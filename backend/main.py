import json
import random
import os
import io
import csv
from contextlib import asynccontextmanager
from typing import List, Optional, Dict

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import aiosqlite

from database import get_db, init_db
from models import (
    Exam, QuizResultIn, QuizResultOut, QuestionOut, TopicInfo,
    StatsHistory
)

# ── Load questions from question_banks/ ──────────────────────────────────────
QUESTION_BANKS_DIR = os.path.join(os.path.dirname(__file__), "question_banks")
EXAMS_DATA: Dict[str, List[dict]] = {}

# Hardcoded exam metadata (could be auto-discovered or from config)
EXAMS = [
    Exam(id="ai_practitioner", name="AWS Certified AI Practitioner", description="Fundamentos de IA y ML en AWS"),
    Exam(id="ml_engineer_associate", name="AWS Certified Machine Learning Engineer Associate", description="Ingeniería de ML en AWS"),
]

def load_question_banks():
    global EXAMS_DATA
    for exam in EXAMS:
        json_path = os.path.join(QUESTION_BANKS_DIR, f"{exam.id}.json")
        if os.path.exists(json_path):
            with open(json_path, encoding="utf-8") as f:
                EXAMS_DATA[exam.id] = json.load(f)
        else:
            EXAMS_DATA[exam.id] = []

load_question_banks()


# ── Lifespan ─────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="AWS AI Practitioner Quiz API", lifespan=lifespan)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────────────────────
def _get_topic_questions(exam_id: str, topic: str, difficulty: Optional[str] = None) -> list:
    if exam_id not in EXAMS_DATA:
        raise HTTPException(status_code=404, detail=f"Exam '{exam_id}' not found")
    
    questions = EXAMS_DATA[exam_id]
    
    if topic == "all":
        filtered = questions
    else:
        filtered = [q for q in questions if q.get("topic") == topic]
    
    if difficulty and difficulty != "all":
        filtered = [q for q in filtered if q.get("difficulty") == difficulty]
    
    return filtered


def _get_topics_for_exam(exam_id: str) -> Dict[str, dict]:
    if exam_id not in EXAMS_DATA:
        raise HTTPException(status_code=404, detail=f"Exam '{exam_id}' not found")
    
    questions = EXAMS_DATA[exam_id]
    topics = {}
    for q in questions:
        topic_key = q["topic"]
        if topic_key not in topics:
            # For now, use topic_key as name, could enhance with metadata
            topics[topic_key] = {"name": topic_key, "description": "", "questions": []}
        topics[topic_key]["questions"].append(q)
    return topics


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/api/exams", response_model=List[Exam])
async def get_exams():
    return EXAMS


@app.get("/api/{exam_id}/topics", response_model=List[TopicInfo])
async def get_topics(exam_id: str):
    topics_data = _get_topics_for_exam(exam_id)
    result = []
    # Add "all" meta-topic
    total_questions = sum(len(t["questions"]) for t in topics_data.values())
    result.append(TopicInfo(
        key="all",
        name="Todos los temas",
        description="Preguntas de todos los temas mezcladas",
        question_count=total_questions,
    ))
    for key, topic in topics_data.items():
        result.append(TopicInfo(
            key=key,
            name=topic.get("name", key),
            description=topic.get("description"),
            question_count=len(topic.get("questions", [])),
        ))
    return result


@app.get("/api/{exam_id}/quiz/{topic}/{difficulty}", response_model=List[QuestionOut])
async def get_quiz(
    exam_id: str,
    topic: str,
    difficulty: str,
    num_questions: int = Query(default=10, ge=1, le=20),
):
    questions = _get_topic_questions(exam_id, topic, difficulty)

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for the given exam/topic/difficulty combination",
        )

    # Shuffle and pick
    selected = random.sample(questions, min(num_questions, len(questions)))

    # Return questions WITHOUT correct_answer, but with shuffled options
    result = []
    for q in selected:
        shuffled_options = q["options"][:]
        random.shuffle(shuffled_options)
        result.append(QuestionOut(
            id=q["id"],
            question=q["question"],
            options=shuffled_options,
            difficulty=q.get("difficulty", "basico"),
        ))
    return result


@app.get("/api/{exam_id}/quiz/{topic}/{difficulty}/answers")
async def get_answers(exam_id: str, topic: str, difficulty: str):
    """Returns correct answers + explanations for a topic (used post-quiz)."""
    questions = _get_topic_questions(exam_id, topic, difficulty)
    return {
        q["id"]: {
            "correct_answer": q["options"][q["correct_answer"]],
            "explanation": q.get("explanation", ""),
        }
        for q in questions
    }


@app.post("/api/results", response_model=QuizResultOut)
async def save_result(result: QuizResultIn, db: aiosqlite.Connection = Depends(get_db)):
    percentage = round((result.score / result.total) * 100, 1) if result.total > 0 else 0.0
    answers_json = json.dumps([a.model_dump() for a in result.answers])

    cursor = await db.execute(
        """
        INSERT INTO quiz_results
            (exam_id, topic, difficulty, score, total, percentage,
             started_at, finished_at, duration_seconds, answers_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            result.exam_id, result.topic, result.difficulty, result.score, result.total,
            percentage, result.started_at, result.finished_at,
            result.duration_seconds, answers_json,
        ),
    )
    await db.commit()
    return QuizResultOut(id=cursor.lastrowid, saved=True)


@app.get("/api/{exam_id}/stats")
async def get_stats(exam_id: str, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT * FROM quiz_results WHERE exam_id = ? ORDER BY finished_at DESC",
        (exam_id,),
    ) as cursor:
        rows = await cursor.fetchall()

    if not rows:
        return {
            "total_quizzes": 0,
            "overall_percentage": 0.0,
            "best_streak": 0,
            "history": [],
            "by_topic": [],
        }

    history = [
        {
            "id": r["id"], "exam_id": r["exam_id"], "topic": r["topic"], "difficulty": r["difficulty"],
            "score": r["score"], "total": r["total"], "percentage": r["percentage"],
            "started_at": r["started_at"], "finished_at": r["finished_at"],
            "duration_seconds": r["duration_seconds"],
        }
        for r in rows
    ]

    overall_percentage = round(sum(r["percentage"] for r in rows) / len(rows), 1)

    # Streak: consecutive quizzes with percentage >= 70%
    streak = 0
    for r in rows:
        if r["percentage"] >= 70:
            streak += 1
        else:
            break

    # By topic aggregation
    topic_map = {}
    for r in rows:
        t = r["topic"]
        if t not in topic_map:
            topic_map[t] = []
        topic_map[t].append(r["percentage"])

    by_topic = [
        {
            "topic": t,
            "quizzes": len(percentages),
            "avg_percentage": round(sum(percentages) / len(percentages), 1),
            "best_percentage": round(max(percentages), 1),
        }
        for t, percentages in topic_map.items()
    ]

    return {
        "total_quizzes": len(rows),
        "overall_percentage": overall_percentage,
        "best_streak": streak,
        "history": history,
        "by_topic": by_topic,
    }


@app.get("/api/{exam_id}/stats/{topic}")
async def get_topic_stats(exam_id: str, topic: str, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT * FROM quiz_results WHERE exam_id = ? AND topic = ? ORDER BY finished_at DESC",
        (exam_id, topic),
    ) as cursor:
        rows = await cursor.fetchall()

    if not rows:
        return {"exam_id": exam_id, "topic": topic, "quizzes": 0, "history": []}

    history = [
        {
            "id": r["id"], "score": r["score"], "total": r["total"],
            "percentage": r["percentage"], "difficulty": r["difficulty"],
            "finished_at": r["finished_at"], "duration_seconds": r["duration_seconds"],
        }
        for r in rows
    ]
    percentages = [r["percentage"] for r in rows]

    return {
        "exam_id": exam_id,
        "topic": topic,
        "quizzes": len(rows),
        "avg_percentage": round(sum(percentages) / len(percentages), 1),
        "best_percentage": round(max(percentages), 1),
        "history": history,
    }


@app.get("/api/{exam_id}/export/csv")
async def export_csv(exam_id: str, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT id, exam_id, topic, difficulty, score, total, percentage, started_at, finished_at, duration_seconds FROM quiz_results WHERE exam_id = ? ORDER BY finished_at DESC",
        (exam_id,),
    ) as cursor:
        rows = await cursor.fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Exam", "Tema", "Dificultad", "Aciertos", "Total", "Porcentaje", "Inicio", "Fin", "Duración (s)"])
    for r in rows:
        writer.writerow([r["id"], r["exam_id"], r["topic"], r["difficulty"], r["score"], r["total"],
                         f"{r['percentage']}%", r["started_at"], r["finished_at"], r["duration_seconds"]])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={exam_id}_quiz_history.csv"},
    )


@app.get("/api/health")
async def health():
    return {"status": "ok", "exams": [e.id for e in EXAMS], "question_counts": {exam: len(questions) for exam, questions in EXAMS_DATA.items()}}
