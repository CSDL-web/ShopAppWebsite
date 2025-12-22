from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from decimal import Decimal

class OrderDetailBase(BaseModel):
    order_id: int
    product_id: int
    price: Decimal = Field(..., ge=0)
    number_of_products: int = Field(default=1, gt=0)
    total_money: Decimal = Field(..., ge=0)
    color: Optional[str] = Field(default="", max_length=20)
    coupon_id: Optional[int] = None

class OrderDetailCreate(OrderDetailBase):
    pass

class OrderDetailUpdate(BaseModel):
    id: int
    number_of_products: Optional[int] = None
    total_money: Optional[Decimal] = None
    color: Optional[str] = None

class OrderDetailRead(OrderDetailBase):
    id: int
    model_config = ConfigDict(from_attributes=True)