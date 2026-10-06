from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class BusinessResponse(BaseModel):
    id: int
    nama_usaha: str
    alamat: Optional[str] = None
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class BusinessUpdate(BaseModel):
    nama_usaha: Optional[str] = None
    alamat: Optional[str] = None
