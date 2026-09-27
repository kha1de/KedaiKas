from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class TransactionItemCreate(BaseModel):
    product_id: int
    jumlah: int = Field(..., gt=0)
    harga_jual: Optional[Decimal] = Field(None, ge=0) # If None, backend takes current product price

class TransactionItemResponse(BaseModel):
    id: int
    product_id: int
    nama_produk: Optional[str] = None
    jumlah: int
    harga_jual: Decimal
    subtotal: Decimal
    model_config = ConfigDict(from_attributes=True)

class TransactionCreate(BaseModel):
    tanggal: Optional[datetime] = None
    items: List[TransactionItemCreate] = Field(..., min_length=1)

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    tanggal: datetime
    total: Decimal
    created_at: Optional[datetime] = None
    items: List[TransactionItemResponse] = []
    model_config = ConfigDict(from_attributes=True)
