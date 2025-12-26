# File: app/services/product_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.product_model import Product, ProductImage
from app.dtos.product_dto import ProductDTO
from app.repositories.product_repo import ProductRepository # Dùng Class Repo mới sửa

class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db) # Khởi tạo Repo Class

    def create_product(self, product_dto: ProductDTO):
        # Logic check data
        if product_dto.price < 0:
            raise HTTPException(status_code=400, detail="Giá không hợp lệ")
        
        # Chuẩn bị data
        product_data = product_dto.model_dump(exclude={"images"})
        
        # Lấy list url ảnh
        image_urls = [img.image_url for img in product_dto.images] if product_dto.images else []

        return self.repo.create(product_data, image_urls)

    def get_all_products(self, skip: int, limit: int):
        return self.repo.get_all(skip, limit)

    def get_product_by_id(self, product_id: int):
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        return product

    def update_product(self, product_id: int, product_dto: ProductDTO):
        # Logic update...
        product_data = product_dto.model_dump(exclude={"images"}, exclude_unset=True)
        image_urls = [img.image_url for img in product_dto.images] if product_dto.images else None
        
        updated = self.repo.update(product_id, product_data, image_urls)
        if not updated:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        return updated
        
    def delete_product(self, product_id: int):
        success = self.repo.delete(product_id)
        if not success:
             raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        return {"message": "Xóa thành công"}