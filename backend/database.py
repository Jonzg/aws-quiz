import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "quiz.db")


async def get_db():
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                percentage REAL NOT NULL,
                started_at TEXT NOT NULL,
                finished_at TEXT NOT NULL,
                duration_seconds INTEGER NOT NULL,
                answers_json TEXT NOT NULL
            )
        """)
        await db.commit()
