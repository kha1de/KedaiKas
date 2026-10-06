from fastapi import APIRouter, Depends
from app.repositories import get_repository, BaseRepository
from app.schemas.analysis import (
    PriceAnalysisResponse,
    ProductAnalysisResponse,
    FinancialAnalysisResponse,
    InsightsResponse
)
from app.services.analysis_service import AnalysisService
from app.services.insight_service import InsightService
from app.api.deps import require_manager

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/price", response_model=PriceAnalysisResponse)
def get_price_analysis(
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = AnalysisService(repo)
    return service.get_price_analysis(current_user["id_usaha"])

@router.get("/products", response_model=ProductAnalysisResponse)
def get_product_analysis(
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = AnalysisService(repo)
    return service.get_product_analysis(current_user["id_usaha"])

@router.get("/finance", response_model=FinancialAnalysisResponse)
def get_financial_analysis(
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = AnalysisService(repo)
    return service.get_financial_analysis(current_user["id_usaha"])

@router.get("/insights", response_model=InsightsResponse)
def get_insights(
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = InsightService(repo)
    return service.generate_insights_and_warnings(current_user["id_usaha"])
