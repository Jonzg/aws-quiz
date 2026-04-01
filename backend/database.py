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
        # Create exams table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS exams (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL
            )
        """)
        
        # Create quiz_results table with exam_id
        await db.execute("""
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exam_id TEXT NOT NULL,
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
        
        # Add exam_id column if it doesn't exist (migration)
        try:
            await db.execute("ALTER TABLE quiz_results ADD COLUMN exam_id TEXT DEFAULT 'ai_practitioner'")
            await db.commit()
        except aiosqlite.OperationalError:
            # Column already exists
            pass
        
        await db.commit()
