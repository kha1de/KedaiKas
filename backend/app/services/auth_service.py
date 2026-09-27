from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate

class AuthService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def register(self, user_in: UserCreate) -> Dict[str, Any]:
        existing = self.repo.get_user_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar. Silakan gunakan email lain atau login."
            )
        hashed_pwd = hash_password(user_in.password)
        user = self.repo.create_user(
            nama=user_in.nama,
            email=user_in.email,
            password_hash=hashed_pwd
        )
        return user

    def authenticate(self, email: str, password: str) -> Dict[str, Any]:
        user = self.repo.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah."
            )
        if not verify_password(password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah."
            )
        return user

    def create_token(self, user: Dict[str, Any]) -> str:
        return create_access_token(subject=user["id"])

    def get_current_user(self, user_id: int) -> Dict[str, Any]:
        user = self.repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User tidak ditemukan."
            )
        return user
