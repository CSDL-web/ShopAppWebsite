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

    # [MỚI THÊM] Service gọi Repo để lấy list sản phẩm theo danh mục
    def get_products_by_category(self, category_id: int, skip: int, limit: int):
        return self.repo.get_by_category_id(category_id, skip, limit)

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

    def get_filtered_products(
        self, 
        keyword: Optional[str],
        min_price: Optional[float],
        max_price: Optional[float],
        category_id: Optional[int],
        sort_by: Optional[str],
        skip: int,
        limit: int
    ):
        # Validate logic giá logic (nếu cần)
        if min_price is not None and min_price < 0:
            raise HTTPException(status_code=400, detail="Giá tối thiểu không được âm")
        if max_price is not None and max_price < 0:
            raise HTTPException(status_code=400, detail="Giá tối đa không được âm")
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(status_code=400, detail="Khoảng giá không hợp lệ")

        return self.repo.filter_products(
            keyword, min_price, max_price, category_id, sort_by, skip, limit
        )

    def get_recommendations(self, product_id: int, limit: int):
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
            
        return self.repo.get_recommendations(product_id, limit)