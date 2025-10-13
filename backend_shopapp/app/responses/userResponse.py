from pydantic import BaseModel
from datetime import date
from typing import Optional

class RoleResponse(BaseModel):
    id: int
    name: str

class UserResponse(BaseModel):
    id: int
    full_name: Optional[str]
    phone_number: str
    address: Optional[str]
    is_active: bool
    date_of_birth: Optional[date]
    facebook_account_id: int
    google_account_id: int
    role: Optional[RoleResponse]

    class Config:
        orm_mode = True
