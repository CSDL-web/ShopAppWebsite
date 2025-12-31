from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(100))
    price = Column(Integer, default = 0)
    thumbnail = Column(String(255))
    description = Column(String(100))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    
    # Thêm quantity nếu DTO yêu cầu (tùy bạn, nếu không cần thì xóa dòng này)
    quantity = Column(Integer, default=0) 

    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category", back_populates="products")

    images = relationship("ProductImage", back_populates="product", cascade="all, delete") 
    comments = relationship("Comment", back_populates="product", cascade="all, delete")  
    order_details = relationship("OrderDetail", back_populates="product")
    favorites = relationship("Favorite", back_populates="product", cascade="all, delete")

class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key = True, index = True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(255))
    
    product = relationship("Product", back_populates="images")