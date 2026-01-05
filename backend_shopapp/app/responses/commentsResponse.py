from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
