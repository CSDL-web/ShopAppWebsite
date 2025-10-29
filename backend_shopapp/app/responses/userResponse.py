from pydantic import BaseModel
from typing import Optional
from datetime import date

class RoleResponse(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    fullname: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None
    date_of_birth: Optional[date] = None
    facebook_account_id: Optional[int] = None
    google_account_id: Optional[int] = None
    role: Optional[RoleResponse]  
    class Config:
        orm_mode = True
