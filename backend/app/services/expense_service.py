from typing import List, Dict, Any, Optional
from datetime import date
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

class ExpenseService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_all(
        self, 
        business_id: int, 
        start_date: Optional[date] = None, 
        end_date: Optional[date] = None
    ) -> List[Dict[str, Any]]:
        return self.repo.get_expenses(business_id, start_date, end_date)

    def get_by_id(self, business_id: int, expense_id: int) -> Dict[str, Any]:
        e = self.repo.get_expense_by_id(business_id, expense_id)
        if not e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pengeluaran dengan ID {expense_id} tidak ditemukan."
            )
        return e

    def create(self, business_id: int, expense_in: ExpenseCreate, user_id: Optional[int] = None) -> Dict[str, Any]:
        data = expense_in.model_dump()
        return self.repo.create_expense(business_id, data, user_id=user_id)

    def update(self, business_id: int, expense_id: int, expense_in: ExpenseUpdate) -> Dict[str, Any]:
        data = expense_in.model_dump(exclude_unset=True)
        updated = self.repo.update_expense(business_id, expense_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pengeluaran dengan ID {expense_id} tidak ditemukan."
            )
        return updated

    def delete(self, business_id: int, expense_id: int) -> Dict[str, str]:
        success = self.repo.delete_expense(business_id, expense_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pengeluaran dengan ID {expense_id} tidak ditemukan."
            )
        return {"message": f"Pengeluaran {expense_id} berhasil dihapus."}
