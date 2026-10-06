from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    nama: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserCreateStaff(UserBase):
    password: str
    role: Literal["owner", "manager", "kasir"] = "kasir"

class UserUpdateRole(BaseModel):
    role: Literal["owner", "manager", "kasir"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str = "kasir"
    id_usaha: Optional[int] = 1
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    id_usaha: Optional[int] = None
