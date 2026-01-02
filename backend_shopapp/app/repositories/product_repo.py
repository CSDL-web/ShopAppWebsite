from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.product_model import Product, ProductImage
from datetime import datetime
from sqlalchemy import func, desc, asc
from app.models.order_detail_model import OrderDetail 

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, product_data: dict, image_urls: List[str] = []) -> Product:
        if 'images' in product_data:
            del product_data['images']

        db_product = Product(**product_data)
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        
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

    def search_by_name(self, keyword: str, skip: int = 0, limit: int = 50) -> List[Product]:
        search_fmt = f"%{keyword}%"
        return self.db.query(Product).filter(
            Product.name.like(search_fmt)
        ).offset(skip).limit(limit).all()

    def update(self, product_id: int, update_data: dict, new_images: Optional[List[str]] = None) -> Optional[Product]:
        db_product = self.get_by_id(product_id)
        if not db_product:
            return None

        for key, value in update_data.items():
            if key != 'images' and value is not None:
                setattr(db_product, key, value)
        
        db_product.updated_at = datetime.now()

        if new_images is not None:
            self.db.query(ProductImage).filter(ProductImage.product_id == product_id).delete()
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

    
    def filter_products(
        self, 
        keyword: str = None,
        min_price: float = None, 
        max_price: float = None, 
        category_id: int = None,
        sort_by: str = None,  # 'price_asc', 'price_desc', 'newest', 'best_selling'
        skip: int = 0, 
        limit: int = 10
    ) -> List[Product]:
        
        query = self.db.query(Product)

        # 1. Lọc theo từ khóa (nếu có)
        if keyword:
            search_fmt = f"%{keyword}%"
            query = query.filter(Product.name.like(search_fmt))

        # 2. Lọc theo Category
        if category_id:
            query = query.filter(Product.category_id == category_id)

        # 3. Lọc theo khoảng giá
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # 4. Sắp xếp
        if sort_by == 'price_asc':
            query = query.order_by(Product.price.asc())
            
        elif sort_by == 'price_desc':
            query = query.order_by(Product.price.desc())
            
        elif sort_by == 'newest':
            query = query.order_by(Product.created_at.desc())
            
        elif sort_by == 'best_selling':
            # Logic phức tạp: Join với bảng OrderDetail, nhóm theo ProductID và tính tổng số lượng bán
            query = query.outerjoin(OrderDetail, Product.id == OrderDetail.product_id)\
                         .group_by(Product.id)\
                         .order_by(func.sum(OrderDetail.number_of_products).desc())
        else:
            # Mặc định sắp xếp theo ngày tạo mới nhất nếu không chọn gì
            query = query.order_by(Product.created_at.desc())

        return query.offset(skip).limit(limit).all()

    
    def get_recommendations(self, product_id: int, limit: int = 6) -> List[Product]:
        # Lấy thông tin sản phẩm hiện tại để biết category_id
        current_product = self.get_by_id(product_id)
        if not current_product:
            return []
        
        return self.db.query(Product).filter(
            Product.category_id == current_product.category_id, # Cùng danh mục
            Product.id != product_id # Không lấy lại chính nó
        ).limit(limit).all()