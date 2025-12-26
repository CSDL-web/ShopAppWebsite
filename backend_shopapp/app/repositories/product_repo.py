from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.product_model import Product, ProductImage
from datetime import datetime

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, product_data: dict, image_urls: List[str] = []) -> Product:
        # Xóa field 'images' khỏi dict nếu có để tránh lỗi khi tạo Product
        if 'images' in product_data:
            del product_data['images']

        db_product = Product(**product_data)
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        
        # Thêm ảnh sau khi đã có Product ID
        if image_urls:
            for url in image_urls:
                img = ProductImage(product_id=db_product.id, image_url=url)
                self.db.add(img)
            self.db.commit()
            self.db.refresh(db_product)
            
        return db_product

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Product]:
        return self.db.query(Product).offset(skip).limit(limit).all()

    def update(self, product_id: int, update_data: dict, new_images: Optional[List[str]] = None) -> Optional[Product]:
        db_product = self.get_by_id(product_id)
        if not db_product:
            return None

        # Update các trường thông tin
        for key, value in update_data.items():
            if key != 'images' and value is not None:
                setattr(db_product, key, value)
        
        db_product.updated_at = datetime.now()

        # Update ảnh: Xóa ảnh cũ, thêm ảnh mới (nếu có yêu cầu update ảnh)
        if new_images is not None:
            # Xóa toàn bộ ảnh cũ của sản phẩm này
            self.db.query(ProductImage).filter(ProductImage.product_id == product_id).delete()
            # Thêm ảnh mới
            for url in new_images:
                img = ProductImage(product_id=product_id, image_url=url)
                self.db.add(img)

        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def delete(self, product_id: int) -> bool:
        db_product = self.get_by_id(product_id)
        if db_product:
            self.db.delete(db_product)
            self.db.commit()
            return True
        return False