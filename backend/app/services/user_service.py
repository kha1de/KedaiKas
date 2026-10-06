from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.core.security import hash_password
from app.schemas.user import UserCreateStaff, UserUpdateRole

class UserService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_users_by_business(self, business_id: int) -> List[Dict[str, Any]]:
        return self.repo.get_users_by_business(business_id)

    def create_staff(self, business_id: int, staff_in: UserCreateStaff) -> Dict[str, Any]:
        existing = self.repo.get_user_by_email(staff_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar dalam sistem."
            )
        hashed_pwd = hash_password(staff_in.password)
        created = self.repo.create_user(
            nama=staff_in.nama,
            email=staff_in.email,
            password_hash=hashed_pwd,
            role=staff_in.role,
            id_usaha=business_id
        )
        return created

    def update_role(self, business_id: int, user_id: int, role_in: UserUpdateRole, current_user_id: int) -> Dict[str, Any]:
        target_user = self.repo.get_user_by_id(user_id)
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pengguna dengan ID {user_id} tidak ditemukan."
            )
        if target_user.get("id_usaha") != business_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Anda tidak memiliki akses ke anggota usaha lain."
            )
        # Prevent self-demotion from owner if sole owner
        if user_id == current_user_id and role_in.role != "owner":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner tidak dapat menurunkan perannya sendiri."
            )
        updated = self.repo.update_user_role(user_id, role_in.role)
        return updated

    def delete_user(self, business_id: int, user_id: int, current_user_id: int) -> Dict[str, str]:
        if user_id == current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tidak dapat menghapus akun Anda sendiri."
            )
        target_user = self.repo.get_user_by_id(user_id)
        if not target_user or target_user.get("id_usaha") != business_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pengguna dengan ID {user_id} tidak ditemukan pada usaha Anda."
            )
        success = self.repo.delete_user(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gagal menghapus pengguna."
            )
        return {"message": f"Pengguna {target_user['nama']} berhasil dihapus dari usaha."}
