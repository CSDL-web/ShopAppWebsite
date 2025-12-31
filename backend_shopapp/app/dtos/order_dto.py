from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum


class OrderStatus(str, Enum):
    pending = 'pending'
    processing = 'processing'
    shipped = 'shipped'
    delivered = 'delivered'
    cancelled = 'cancelled'

class OrderBase(BaseModel):
    user_id: Optional[int] = None
    fullname: str = Field(..., max_length=100)
    email: str = Field(..., max_length=100) 
    phone_number: str = Field(..., max_length=20)
    address: str = Field(..., max_length=200)
    note: Optional[str] = Field(None, max_length=100)
    status: OrderStatus = Field(default=OrderStatus.pending)
    total_money: float = Field(..., ge=0)
    shipping_method: Optional[str] = Field(None, max_length=100)
    shipping_address: Optional[str] = Field(None, max_length=200)
    shipping_date: Optional[date] = None
    tracking_number: Optional[str] = Field(None, max_length=100)
    payment_method: Optional[str] = Field(None, max_length=100)
    active: bool = True
    coupon_id: Optional[int] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    id: int
    status: Optional[OrderStatus] = None
    shipping_date: Optional[date] = None
    tracking_number: Optional[str] = None
    active: Optional[bool] = None

class OrderRead(OrderBase):
    id: int
    order_date: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)