from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CouponBase(BaseModel):
    code: str = Field(..., max_length=50, description="Mã giảm giá (Unique)")
    active: bool = Field(True, description="Trạng thái hoạt động")

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    id: int
    code: Optional[str] = Field(None, max_length=50)
    active: Optional[bool] = None

class CouponRead(CouponBase):
    id: int

    model_config = ConfigDict(from_attributes=True)