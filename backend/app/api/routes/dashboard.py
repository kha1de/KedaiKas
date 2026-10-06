from fastapi import APIRouter, Depends
from app.repositories import get_repository, BaseRepository
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService
from app.api.deps import require_manager

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = DashboardService(repo)
    return service.get_dashboard_data(current_user["id_usaha"])
