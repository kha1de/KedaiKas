import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from app.core.config import settings

def hash_password(password: str) -> str:
    """Hash password using native bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash, with safe fallback for legacy seed passwords."""
    try:
        if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
            return bcrypt.checkpw(
                plain_password.encode("utf-8"), 
                hashed_password.encode("utf-8")
            )
    except Exception:
        pass
    # Support legacy seed data in database dump (e.g. '123' in project_warung.sql)
    return plain_password == hashed_password

def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token with expiry."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    payload = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    }
    encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
