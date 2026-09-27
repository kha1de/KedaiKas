from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class TargetBase(BaseModel):
    target_laba: Decimal = Field(..., gt=0)
    periode_mulai: date
    periode_selesai: date

class TargetCreate(TargetBase):
    pass

class TargetUpdate(BaseModel):
    target_laba: Optional[Decimal] = Field(None, gt=0)
    periode_mulai: Optional[date] = None
    periode_selesai: Optional[date] = None

class TargetResponse(TargetBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class TargetProgressResponse(BaseModel):
    target: Optional[TargetResponse] = None
    target_laba: Decimal = Decimal("0")
    laba_saat_ini: Decimal = Decimal("0")
    target_gap: Decimal = Decimal("0")
    hari_tersisa: int = 0
    kebutuhan_laba_harian: Decimal = Decimal("0")
    progress_persen: float = 0.0
    status: str = "Belum Ada Target"
