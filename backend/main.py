import json
import random
import os
import io
import csv
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import aiosqlite

from database import get_db, init_db
from models import (
    QuizResultIn, QuizResultOut, QuestionOut, TopicInfo,
    StatsOut, StatsHistory, TopicStats
)

# ── Load questions JSON once at startup ──────────────────────────────────────
QUESTIONS_PATH = os.path.join(os.path.dirname(__file__), "questions_db.json")

with open(QUESTIONS_PATH, encoding="utf-8") as f:
    QUESTIONS_DATA: dict = json.load(f)

TOPICS: dict = QUESTIONS_DATA.get("topics", {})


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
def _get_topic_questions(topic: str, difficulty: Optional[str] = None) -> list:
    if topic == "all":
        questions = []
        for t in TOPICS.values():
            questions.extend(t.get("questions", []))
    else:
        topic_data = TOPICS.get(topic)
        if not topic_data:
            raise HTTPException(status_code=404, detail=f"Topic '{topic}' not found")
        questions = topic_data.get("questions", [])

    if difficulty and difficulty != "all":
        questions = [q for q in questions if q.get("difficulty") == difficulty]

    return questions


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/api/topics", response_model=List[TopicInfo])
async def get_topics():
    result = []
    # Add "all" meta-topic
    total_questions = sum(
        len(t.get("questions", [])) for t in TOPICS.values()
    )
    result.append(TopicInfo(
        key="all",
        name="Todos los temas",
        description="Preguntas de todos los temas mezcladas",
        question_count=total_questions,
    ))
    for key, topic in TOPICS.items():
        result.append(TopicInfo(
            key=key,
            name=topic.get("name", key),
            description=topic.get("description"),
            question_count=len(topic.get("questions", [])),
        ))
    return result


@app.get("/api/quiz/{topic}/{difficulty}", response_model=List[QuestionOut])
async def get_quiz(
    topic: str,
    difficulty: str,
    num_questions: int = Query(default=10, ge=1, le=20),
):
    questions = _get_topic_questions(topic, difficulty)

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for the given topic/difficulty combination",
        )

    # Shuffle and pick
    selected = random.sample(questions, min(num_questions, len(questions)))

    # Return questions WITHOUT correct_answer
    return [
        QuestionOut(
            id=q["id"],
            question=q["question"],
            options=q["options"],
            difficulty=q.get("difficulty", "basico"),
        )
        for q in selected
    ]


@app.get("/api/quiz/{topic}/{difficulty}/answers")
async def get_answers(topic: str, difficulty: str):
    """Returns correct answers + explanations for a topic (used post-quiz)."""
    questions = _get_topic_questions(topic, difficulty)
    return {
        q["id"]: {
            "correct_answer": q["correct_answer"],
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
            (topic, difficulty, score, total, percentage,
             started_at, finished_at, duration_seconds, answers_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            result.topic, result.difficulty, result.score, result.total,
            percentage, result.started_at, result.finished_at,
            result.duration_seconds, answers_json,
        ),
    )
    await db.commit()
    return QuizResultOut(id=cursor.lastrowid, saved=True)


@app.get("/api/stats", response_model=StatsOut)
async def get_stats(db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT * FROM quiz_results ORDER BY finished_at DESC"
    ) as cursor:
        rows = await cursor.fetchall()

    if not rows:
        return StatsOut(
            total_quizzes=0,
            overall_percentage=0.0,
            best_streak=0,
            history=[],
            by_topic=[],
        )

    history = [
        StatsHistory(
            id=r["id"], topic=r["topic"], difficulty=r["difficulty"],
            score=r["score"], total=r["total"], percentage=r["percentage"],
            started_at=r["started_at"], finished_at=r["finished_at"],
            duration_seconds=r["duration_seconds"],
        )
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
    topic_map: dict = {}
    for r in rows:
        t = r["topic"]
        if t not in topic_map:
            topic_map[t] = []
        topic_map[t].append(r["percentage"])

    by_topic = [
        TopicStats(
            topic=t,
            quizzes=len(percentages),
            avg_percentage=round(sum(percentages) / len(percentages), 1),
            best_percentage=round(max(percentages), 1),
        )
        for t, percentages in topic_map.items()
    ]

    return StatsOut(
        total_quizzes=len(rows),
        overall_percentage=overall_percentage,
        best_streak=streak,
        history=history,
        by_topic=by_topic,
    )


@app.get("/api/stats/{topic}")
async def get_topic_stats(topic: str, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT * FROM quiz_results WHERE topic = ? ORDER BY finished_at DESC",
        (topic,),
    ) as cursor:
        rows = await cursor.fetchall()

    if not rows:
        return {"topic": topic, "quizzes": 0, "history": []}

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
        "topic": topic,
        "quizzes": len(rows),
        "avg_percentage": round(sum(percentages) / len(percentages), 1),
        "best_percentage": round(max(percentages), 1),
        "history": history,
    }


@app.get("/api/export/csv")
async def export_csv(db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT id, topic, difficulty, score, total, percentage, started_at, finished_at, duration_seconds FROM quiz_results ORDER BY finished_at DESC"
    ) as cursor:
        rows = await cursor.fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Tema", "Dificultad", "Aciertos", "Total", "Porcentaje", "Inicio", "Fin", "Duración (s)"])
    for r in rows:
        writer.writerow([r["id"], r["topic"], r["difficulty"], r["score"], r["total"],
                         f"{r['percentage']}%", r["started_at"], r["finished_at"], r["duration_seconds"]])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=quiz_history.csv"},
    )


@app.get("/api/health")
async def health():
    return {"status": "ok", "topics": list(TOPICS.keys())}
