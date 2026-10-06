from typing import Dict, Any, List, Callable
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
    
    # Ensure default fallback values for role and id_usaha if missing
    if "role" not in user or not user["role"]:
        user["role"] = "kasir"
    if "id_usaha" not in user or user["id_usaha"] is None:
        user["id_usaha"] = 1
        
    return user

def require_roles(allowed_roles: List[str]) -> Callable:
    """
    Reusable authorization dependency generator.
    Enforces RBAC on the backend: returns HTTP 403 Forbidden if user's role is not in allowed_roles.
    """
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role", "kasir")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak: Peran '{user_role}' tidak memiliki izin untuk tindakan ini."
            )
        return current_user
    return role_checker

# Convenience shortcuts
require_owner = require_roles(["owner"])
require_manager = require_roles(["owner", "manager"])
require_any_staff = require_roles(["owner", "manager", "kasir"])
