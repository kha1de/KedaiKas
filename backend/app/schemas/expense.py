from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class ExpenseBase(BaseModel):
    kategori: str = Field(..., max_length=100)
    nominal: Decimal = Field(..., gt=0)
    tanggal: date
    keterangan: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    kategori: Optional[str] = Field(None, max_length=100)
    nominal: Optional[Decimal] = Field(None, gt=0)
    tanggal: Optional[date] = None
    keterangan: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
