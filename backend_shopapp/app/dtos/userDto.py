from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class UserDTO(BaseModel):
    full_name: Optional[str] = None
    phone_number: str = Field(..., description="Phone number is required")
    password: Optional[str] = Field(None, description="Password cannot be blank")
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    facebook_account_id: Optional[int] = 0
    google_account_id: Optional[int] = 0
    role_id: int
