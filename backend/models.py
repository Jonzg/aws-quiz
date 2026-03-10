from pydantic import BaseModel
from typing import List, Optional


class AnswerRecord(BaseModel):
    id: int
    user_answer: str
    correct_answer: str
    is_correct: bool


class QuizResultIn(BaseModel):
    topic: str
    difficulty: str
    score: int
    total: int
    started_at: str
    finished_at: str
    duration_seconds: int
    answers: List[AnswerRecord]


class QuizResultOut(BaseModel):
    id: int
    saved: bool


class QuestionOut(BaseModel):
    id: int
    question: str
    options: List[str]
    difficulty: str
    # correct_answer intentionally omitted — sent only after submission


class TopicInfo(BaseModel):
    key: str
    name: str
    description: Optional[str] = None
    question_count: int


class StatsHistory(BaseModel):
    id: int
    topic: str
    difficulty: str
    score: int
    total: int
    percentage: float
    started_at: str
    finished_at: str
    duration_seconds: int


class TopicStats(BaseModel):
    topic: str
    quizzes: int
    avg_percentage: float
    best_percentage: float


class StatsOut(BaseModel):
    total_quizzes: int
    overall_percentage: float
    best_streak: int
    history: List[StatsHistory]
    by_topic: List[TopicStats]
