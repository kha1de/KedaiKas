from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class ProductBase(BaseModel):
    nama_produk: str = Field(..., max_length=150)
    kategori: Optional[str] = Field(None, max_length=100)
    harga_modal: Decimal = Field(..., ge=0)
    harga_jual: Decimal = Field(..., ge=0)
    satuan: str = Field(..., max_length=30)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    nama_produk: Optional[str] = Field(None, max_length=150)
    kategori: Optional[str] = Field(None, max_length=100)
    harga_modal: Optional[Decimal] = Field(None, ge=0)
    harga_jual: Optional[Decimal] = Field(None, ge=0)
    satuan: Optional[str] = Field(None, max_length=30)

class ProductResponse(ProductBase):
    id: int
    user_id: int
    margin_persen: float = 0.0
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
