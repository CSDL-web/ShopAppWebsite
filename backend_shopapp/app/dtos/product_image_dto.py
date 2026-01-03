from pydantic import BaseModel, ConfigDict, Field

class ProductImageBase(BaseModel):
    product_id: int = Field(..., description="ID của sản phẩm")
    image_url: str = Field(..., max_length=300, description="Đường dẫn URL của ảnh")

class ProductImageUpdate(BaseModel):
    image_url: str = Field(..., max_length=300, description="URL ảnh mới")

class ProductImageRead(ProductImageBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)