from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.product_model import ProductImage 

class ProductImageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_product_id(self, product_id: int) -> List[ProductImage]:
        return self.db.query(ProductImage).filter(ProductImage.product_id == product_id).all()

    def get_by_id(self, image_id: int) -> Optional[ProductImage]:
        return self.db.query(ProductImage).filter(ProductImage.id == image_id).first()


    def update(self, image_id: int, image_url: str) -> Optional[ProductImage]:
        db_image = self.get_by_id(image_id)
        if db_image:
            db_image.image_url = image_url
            self.db.commit()
            self.db.refresh(db_image)
        return db_image