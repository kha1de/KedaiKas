from fastapi import APIRouter, Depends
from app.repositories import get_repository, BaseRepository
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.services.simulation_service import SimulationService
from app.api.deps import require_manager

router = APIRouter(prefix="/simulation", tags=["CobaDulu Simulation"])

@router.post("", response_model=SimulationResponse)
def run_simulation(
    sim_req: SimulationRequest,
    current_user: dict = Depends(require_manager),
    repo: BaseRepository = Depends(get_repository)
):
    service = SimulationService(repo)
    return service.run_simulation(current_user["id_usaha"], sim_req)
