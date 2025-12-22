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
    category_id = Column(Integer,default = 0)

    # quan hệ 1 - Nhiều : (1 sản phầm có nhiều ảnh)
    images = relationship("ProductImage",back_populates = "product_images", cascade="all, delete") # thuộc tính ảo
    comments = relationship("Comment", back_populates="product_comments", cascade="all, delete")  # thuộc tính ảo

class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key = True, index = True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(255))
    product_images = relationship("Product", back_populates="images") # thuộc tínhcascade="all, delete" ảo
    