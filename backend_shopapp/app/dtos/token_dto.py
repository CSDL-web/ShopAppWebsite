from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TokenDTO(BaseModel):
    access_token: str = Field(..., description="Token dùng để xác thực")
    token_type: str = Field(default="bearer", description="Loại token (thường là Bearer)")
    expiration: datetime = Field(..., description="Thời gian hết hạn của Access Token")
    refresh_token: str = Field(..., description="Token dùng để lấy lại Access Token mới")
    refresh_expiration_date: datetime = Field(..., description="Thời gian hết hạn của Refresh Token")
    is_mobile: bool = Field(default=False, description="Token này dành cho thiết bị di động hay web")
    
    class Config:
        from_attributes = True