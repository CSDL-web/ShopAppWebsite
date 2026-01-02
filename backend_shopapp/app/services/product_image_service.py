from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.repositories.product_image_repo import ProductImageRepository
from app.dtos.product_image_dto import ProductImageUpdate
from app.models.product_model import ProductImage

class ProductImageService:
    def __init__(self, db: Session):
        self.repo = ProductImageRepository(db)


    def get_images_by_product(self, product_id: int) -> List[ProductImage]:
        return self.repo.get_by_product_id(product_id)

    def get_image_by_id(self, image_id: int) -> ProductImage:
        image = self.repo.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
        return image


    def update_product_image(self, image_id: int, data: ProductImageUpdate) -> ProductImage:

        updated_image = self.repo.update(image_id, data.image_url)

        if not updated_image:
            raise HTTPException(status_code=404, detail="Không tìm thấy ảnh để cập nhật")
            
        return updated_image