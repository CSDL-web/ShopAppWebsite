from pydantic import BaseModel, Field
from typing import Optional, List

class CommentDTO(BaseModel):
    user_id: int
    product_id: int
    content: str = Field(..., description="Nội dung bình luận")
