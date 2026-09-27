from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from app.repositories import get_repository, BaseRepository
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.services.expense_service import ExpenseService
from app.api.deps import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ExpenseService(repo)
    return service.get_all(current_user["id"], start_date, end_date)

@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: ExpenseCreate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ExpenseService(repo)
    return service.create(current_user["id"], expense_in)

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_in: ExpenseUpdate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ExpenseService(repo)
    return service.update(current_user["id"], expense_id, expense_in)

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ExpenseService(repo)
    return service.delete(current_user["id"], expense_id)
