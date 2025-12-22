from sqlalchemy.orm import Session
from typing import Optional
from app.models.product_model import Product, ProductImage  # hoặc from models import Product nếu đã import sẵn
from datetime import datetime


def create_product_repo(db: Session, product: Product) -> Product:
    db.add(product)
    db.commit()
    db.refresh(product)  # cập nhật lại đối tượng sau khi thêm vào DB
    return product

def find_product_by_name(db: Session, name: str) -> Optional[Product]:
    return db.query(Product).filter(Product.name == name).first()

def find_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def get_all_products_repo(db: Session):
    return db.query(Product).all()

def update_product_repo(db: Session, product: Product, new_data: dict) -> Product:
    # Cập nhật các field thông thường
    for key, value in new_data.items():
        if key == "images":
            continue  # xử lý images riêng
        setattr(product, key, value)

    # Xử lý images nếu có
    if "images" in new_data:
        product.images.clear()  # xóa hết image cũ (vì cascade="all, delete")
        for img_url in new_data["images"]:
            # Đảm bảo img là dict có 'image_url'
            if isinstance(img_url, dict) and "image_url" in img_url:
                new_image = ProductImage(image_url=img_url["image_url"])
                product.images.append(new_image)

    product.updated_at = datetime.now()
    db.commit()
    db.refresh(product)
    return product

def delete_product_repo(db: Session, product_id: int) -> bool:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return False

    db.delete(product)
    db.commit()
    return True