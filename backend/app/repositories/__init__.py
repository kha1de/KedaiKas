from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.repositories.base import BaseRepository
from app.repositories.mock_repository import MockRepository
from app.repositories.sql_repository import SqlRepository

# Singleton mock repository instance
_mock_repo_instance = MockRepository()

def get_repository(db: Session = Depends(get_db)) -> BaseRepository:
    """
    Dependency injection for repository.
    Falls back gracefully to MockRepository if database is not configured or unavailable.
    """
    if settings.USE_MOCK_REPO:
        return _mock_repo_instance

    # If SQL mode requested but db session is None, fall back to mock
    if db is None:
        return _mock_repo_instance

    try:
        # Check DB alive
        return SqlRepository(db)
    except Exception:
        return _mock_repo_instance

__all__ = ["BaseRepository", "MockRepository", "SqlRepository", "get_repository"]
