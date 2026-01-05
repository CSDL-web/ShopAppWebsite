from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from decimal import Decimal

class CouponConditionBase(BaseModel):
    coupon_id: int
    attribute: str = Field(..., max_length=255, description="Thuộc tính kiểm tra (vd: total_amount)")
    operator: str = Field(..., max_length=10, description="Toán tử (>, <, ==)")
    value: str = Field(..., max_length=255, description="Giá trị so sánh")
    discount_amount: Decimal = Field(..., description="Số tiền giảm")

class CouponConditionCreate(CouponConditionBase):
    pass

class CouponConditionUpdate(BaseModel):
    id: int
    attribute: Optional[str] = Field(None, max_length=255)
    operator: Optional[str] = Field(None, max_length=10)
    value: Optional[str] = Field(None, max_length=255)
    discount_amount: Optional[Decimal] = None

class CouponConditionRead(CouponConditionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)