from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional
from datetime import date

class UserDTO(BaseModel):
    fullname: str = Field(..., max_length=100)
    phone_number: Optional[str] = Field(None, max_length=15)
    password: str = Field(..., min_length=6)
    address: Optional[str] = Field(None, max_length=200)
    date_of_birth: Optional[date] = None
    email: Optional[str] = Field(None, max_length=255)
    facebook_account_id: Optional[str] = Field(default=None)
    google_account_id: Optional[str] = Field(default=None)
    role_id: int = Field(default=1)

    @model_validator(mode='after')
    def check_contact_info(self):
        if not self.phone_number and not self.email:
            raise ValueError('Phải cung cấp ít nhất Số điện thoại hoặc Email để đăng ký')
        return self

class UserRead(BaseModel):
    id: int
    fullname: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    facebook_account_id: Optional[str] = None
    google_account_id: Optional[str] = None
    role_id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class UserUpdateProfileDTO(BaseModel):
    fullname: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=200)
    date_of_birth: Optional[date] = None
    facebook_account_id: Optional[str] = None
    google_account_id: Optional[str] = None

class ChangePasswordDTO(BaseModel):
    old_password: str = Field(..., min_length=6, description="Mật khẩu hiện tại")
    new_password: str = Field(..., min_length=6, description="Mật khẩu mới")
    confirm_new_password: str = Field(..., min_length=6, description="Nhập lại mật khẩu mới")

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.new_password != self.confirm_new_password:
            raise ValueError('Mật khẩu mới và xác nhận mật khẩu không khớp')
        return self

class AdminUpdateUserStatusDTO(BaseModel):
    is_active: bool