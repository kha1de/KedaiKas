from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

Base = declarative_base()

# We only create engine if not using mock repository or when needed
engine = None
SessionLocal = None

try:
    db_url = settings.DATABASE_URL
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 3600,
        "echo": False,
    }

    # psycopg (PostgreSQL) does not support 'charset' connect_arg used by pymysql.
    # No extra connect_args needed for psycopg; it works out of the box.
    # For MariaDB/MySQL via pymysql, no extra connect_args needed either.
    # pool_recycle is safe for both dialects.

    engine = create_engine(db_url, **engine_kwargs)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception:
    engine = None
    SessionLocal = None

def get_db():
    """Dependency for obtaining database session."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
