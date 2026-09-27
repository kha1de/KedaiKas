from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.repositories import get_repository, BaseRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    repo: BaseRepository = Depends(get_repository)
) -> Dict[str, Any]:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token otentikasi tidak disediakan.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau telah kedaluwarsa.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identitas token tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pengguna tidak ditemukan dalam sistem.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
