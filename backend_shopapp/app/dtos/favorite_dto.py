from pydantic import BaseModel, ConfigDict
from typing import Optional

class FavoriteBase(BaseModel):
    user_id: int
    product_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteRead(FavoriteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)