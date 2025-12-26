from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal

class ProductImageDTO(BaseModel):
    image_url: str = Field(..., description="URL của hình ảnh sản phẩm")
    class Config:
        from_attributes = True

class ProductDTO(BaseModel):
    name: str = Field(..., description="Tên sản phẩm")
    price: Decimal = Field(..., ge=0, description="Giá sản phẩm") 
    thumbnail: Optional[str] = None
    description: Optional[str] = Field(None, description="Mô tả sản phẩm")
    

    category_id: int = Field(..., description="ID của danh mục")
    
    # Bổ sung bắt buộc
    quantity: int = Field(default=0, ge=0, description="Số lượng tồn kho")
    
    images: Optional[List[ProductImageDTO]] = Field(default_factory=list)

    class Config:
        from_attributes = True