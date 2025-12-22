from pydantic import BaseModel, Field
from typing import List, Optional

class ProductImageDTO(BaseModel):
    image_url: str = Field(..., description="URL của hình ảnh sản phẩm")

class ProductDTO(BaseModel):
    name: str = Field(..., description="Tên sản phẩm")
    description: Optional[str] = Field(None, description="Mô tả sản phẩm")
    price: int = Field(..., ge=0, description="Giá sản phẩm (>= 0)")
    category: Optional[str] = None
    # stock_quantity: Optional[int] = Field(0, ge=0, description="Số lượng trong kho")    # có thể bị sửa trong sql mà ko được thêm lại ? 
    images: Optional[List[ProductImageDTO]] = Field(default_factory=list)

    class Config:
        from_attributes = True  # (tương đương orm_mode=True trong Pydantic v1)