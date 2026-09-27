from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as products_router
from app.api.routes.transactions import router as transactions_router
from app.api.routes.expenses import router as expenses_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes.targets import router as targets_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.reports import router as reports_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(products_router)
api_router.include_router(transactions_router)
api_router.include_router(expenses_router)
api_router.include_router(dashboard_router)
api_router.include_router(analysis_router)
api_router.include_router(targets_router)
api_router.include_router(simulation_router)
api_router.include_router(reports_router)
