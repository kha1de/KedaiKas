from fastapi import APIRouter, Depends, HTTPException, status
from app.repositories import get_repository, BaseRepository
from app.schemas.business import BusinessResponse, BusinessUpdate
from app.api.deps import require_any_staff, require_owner

router = APIRouter(prefix="/settings", tags=["Store Settings"])

@router.get("", response_model=BusinessResponse)
def get_store_settings(
    current_user: dict = Depends(require_any_staff),
    repo: BaseRepository = Depends(get_repository)
):
    business_id = current_user.get("id_usaha", 1)
    business = repo.get_business_by_id(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil usaha tidak ditemukan."
        )
    return business

@router.put("", response_model=BusinessResponse)
def update_store_settings(
    update_in: BusinessUpdate,
    current_user: dict = Depends(require_owner),
    repo: BaseRepository = Depends(get_repository)
):
    business_id = current_user.get("id_usaha", 1)
    updated = repo.update_business(business_id, update_in.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil usaha tidak ditemukan."
        )
    return updated
