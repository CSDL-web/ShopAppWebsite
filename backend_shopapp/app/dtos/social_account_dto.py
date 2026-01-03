from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional

class SocialAccountBase(BaseModel):
    provider: str = Field(..., max_length=20, description="Nhà cung cấp (Google, Facebook)")
    provider_id: str = Field(..., max_length=50, description="ID của tài khoản MXH")
    email: EmailStr = Field(..., max_length=150, description="Email của tài khoản MXH")
    name: str = Field(..., max_length=100, description="Tên người dùng trên MXH")

class SocialAccountCreate(SocialAccountBase):
    pass

class SocialAccountRead(SocialAccountBase):
    id: int
    user_id: int # Để biết tài khoản này của User nào
    
    model_config = ConfigDict(from_attributes=True)