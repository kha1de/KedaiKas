from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from app.repositories import get_repository, BaseRepository
from app.schemas.report import ReportResponse
from app.services.report_service import ReportService
from app.api.deps import require_manager

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=ReportResponse)
def get_reports(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = ReportService(repo)
    return service.generate_report(current_user["id_usaha"], start_date, end_date)
