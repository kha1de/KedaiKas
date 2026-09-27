from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, status
from app.repositories import get_repository, BaseRepository
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import TransactionService
from app.api.deps import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TransactionService(repo)
    return service.get_all(current_user["id"], start_date, end_date)

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    tx_in: TransactionCreate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TransactionService(repo)
    return service.create(current_user["id"], tx_in)

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TransactionService(repo)
    return service.get_by_id(current_user["id"], transaction_id)

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = TransactionService(repo)
    return service.delete(current_user["id"], transaction_id)
