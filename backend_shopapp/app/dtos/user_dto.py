from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date

class UserDTO(BaseModel):
    fullname: str = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=15)
    password: str = Field(..., min_length=6)
    address: Optional[str] = Field(None, max_length=200)
    date_of_birth: Optional[date] = None
    email: Optional[str] = Field(None, max_length=255)
    facebook_account_id: Optional[str] = Field(default=None)
    google_account_id: Optional[str] = Field(default=None)
    role_id: int = Field(default=1)

class UserRead(BaseModel):
    id: int
    fullname: Optional[str] = None
    phone_number: str
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    facebook_account_id: Optional[str] = None
    google_account_id: Optional[str] = None
    role_id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
