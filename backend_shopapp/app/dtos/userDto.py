from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date

# --- Request DTO (Dữ liệu gửi lên để tạo/sửa) ---
class UserDTO(BaseModel):
    full_name: Optional[str] = None
    phone_number: str = Field(..., description="Phone number is required")
    password: Optional[str] = Field(None, description="Password cannot be blank")
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    facebook_account_id: Optional[int] = 0
    google_account_id: Optional[int] = 0
    role_id: int


class UserRead(BaseModel):
    id: int
    full_name: Optional[str] = None
    phone_number: str
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    facebook_account_id: Optional[int] = 0
    google_account_id: Optional[int] = 0
    role_id: int
    
    
    model_config = ConfigDict(from_attributes=True)