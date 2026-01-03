from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.product_image_service import ProductImageService
from app.dtos.product_image_dto import ProductImageRead, ProductImageUpdate
from app.models.user_model import User
from app.services.auth_service import get_current_user 

product_image_router = APIRouter(prefix="/product-images", tags=["Product Images"])

def get_service(db: Session = Depends(get_db)) -> ProductImageService:
    return ProductImageService(db)



@product_image_router.get("/product/{product_id}", response_model=List[ProductImageRead])
def get_images_by_product(
    product_id: int, 
    service: ProductImageService = Depends(get_service)
):
    """Lấy danh sách tất cả ảnh của một sản phẩm"""
    return service.get_images_by_product(product_id)

@product_image_router.get("/{image_id}", response_model=ProductImageRead)
def get_image_by_id(
    image_id: int, 
    service: ProductImageService = Depends(get_service)
):
    """Lấy chi tiết URL của một ảnh cụ thể"""

    return service.get_image_by_id(image_id)


@product_image_router.put("/{image_id}", response_model=ProductImageRead)
def update_product_image(
    image_id: int, 
    data: ProductImageUpdate, 
    service: ProductImageService = Depends(get_service),
    current_user: User = Depends(get_current_user) 
):
    """Cập nhật URL ảnh mới cho một ID ảnh đã có"""
    if current_user.role.name != 'admin': raise HTTPException(...)
    return service.update_product_image(image_id, data)