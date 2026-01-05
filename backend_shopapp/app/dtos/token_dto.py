from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TokenDTO(BaseModel):
    access_token: str = Field(...)
    token_type: str = Field(default="bearer")
    expiration: datetime = Field(...)
    refresh_token: str = Field(...)
    refresh_expiration_date: datetime = Field(...)
    is_mobile: bool = Field(default=False)

    class Config:
        from_attributes = True

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(...)
