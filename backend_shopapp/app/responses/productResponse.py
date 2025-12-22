from pydantic import BaseModel
from datetime import date
from typing import Optional


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: Optional[str]
    thumbnail: Optional[str]
    class Config:
        from_attributes = True
