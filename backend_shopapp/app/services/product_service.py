from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
from app.models.product_model import Product, ProductImage
from app.dtos.product_dto import ProductDTO
from app.repositories.product_repo import ProductRepository

class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)

    def create_product(self, product_dto: ProductDTO):
        if product_dto.price < 0:
            raise HTTPException(status_code=400, detail="Giá không hợp lệ")
        
        product_data = product_dto.model_dump(exclude={"images"})
        image_urls = [img.image_url for img in product_dto.images] if product_dto.images else []

        return self.repo.create(product_data, image_urls)

    def get_all_products(self, keyword: Optional[str], skip: int, limit: int):
        if keyword:
            return self.repo.search_by_name(keyword, skip, limit)
        else:
            return self.repo.get_all(skip, limit)

    def get_product_by_id(self, product_id: int):
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        return product

    def update_product(self, product_id: int, product_dto: ProductDTO):
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
