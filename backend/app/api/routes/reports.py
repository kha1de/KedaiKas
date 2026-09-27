from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from app.repositories import get_repository, BaseRepository
from app.schemas.report import ReportResponse
from app.services.report_service import ReportService
from app.api.deps import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=ReportResponse)
def get_reports(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ReportService(repo)
    return service.generate_report(current_user["id"], start_date, end_date)
