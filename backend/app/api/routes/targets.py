from typing import List
from fastapi import APIRouter, Depends, status
from app.repositories import get_repository, BaseRepository
from app.schemas.target import TargetCreate, TargetUpdate, TargetResponse, TargetProgressResponse
from app.services.target_service import TargetService
from app.api.deps import get_current_user

router = APIRouter(prefix="/targets", tags=["Targets"])

@router.get("", response_model=List[TargetResponse])
def list_targets(
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TargetService(repo)
    return service.get_targets(current_user["id"])

@router.get("/progress", response_model=TargetProgressResponse)
def get_target_progress(
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TargetService(repo)
    return service.get_target_progress(current_user["id"])

@router.post("", response_model=TargetResponse, status_code=status.HTTP_201_CREATED)
def create_target(
    target_in: TargetCreate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TargetService(repo)
    return service.create_target(current_user["id"], target_in)

@router.put("/{target_id}", response_model=TargetResponse)
def update_target(
    target_id: int,
    target_in: TargetUpdate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TargetService(repo)
    return service.update_target(current_user["id"], target_id, target_in)
