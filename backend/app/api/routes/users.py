from typing import List
from fastapi import APIRouter, Depends, status
from app.repositories import get_repository, BaseRepository
from app.schemas.user import UserResponse, UserCreateStaff, UserUpdateRole
from app.services.user_service import UserService
from app.api.deps import require_owner

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserResponse])
def list_business_users(
    current_user: dict = Depends(require_owner),
    repo: BaseRepository = Depends(get_repository)
):
    service = UserService(repo)
    return service.get_users_by_business(current_user["id_usaha"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_staff_user(
    user_in: UserCreateStaff,
    current_user: dict = Depends(require_owner),
    repo: BaseRepository = Depends(get_repository)
):
    service = UserService(repo)
    return service.create_staff(current_user["id_usaha"], user_in)

@router.put("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    role_in: UserUpdateRole,
    current_user: dict = Depends(require_owner),
    repo: BaseRepository = Depends(get_repository)
):
    service = UserService(repo)
    return service.update_role(current_user["id_usaha"], user_id, role_in, current_user["id"])

@router.delete("/{user_id}")
def delete_business_user(
    user_id: int,
    current_user: dict = Depends(require_owner),
    repo: BaseRepository = Depends(get_repository)
):
    service = UserService(repo)
    return service.delete_user(current_user["id_usaha"], user_id, current_user["id"])
