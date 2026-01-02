from pydantic import BaseModel, Field


class UserLoginDTO(BaseModel):
    account: str = Field(..., description="Số điện thoại hoặc Email")
    password: str = Field(..., description="password không được để trống")