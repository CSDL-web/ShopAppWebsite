from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import date, datetime

# DTO Dùng để Đăng ký / Tạo User (Request)
class UserDTO(BaseModel):
    fullname: str = Field(..., max_length=100, description="Họ và tên")
    phone_number: str = Field(..., max_length=15, description="Số điện thoại")
    password: str = Field(..., min_length=6, description="Mật khẩu")
    address: Optional[str] = Field(None, max_length=200)
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = Field(None, max_length=255)
    
    facebook_account_id: Optional[str] = Field(default=None)
    google_account_id: Optional[str] = Field(default=None)
    
    # role_id mặc định backend tự set là 1 (User), không cho client gửi lên để tránh hack



# DTO Dùng để trả dữ liệu về (Response)
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
    
    # Thêm list social accounts nếu muốn hiển thị luôn
    # social_accounts: list[SocialAccountRead] = [] 

    model_config = ConfigDict(from_attributes=True)