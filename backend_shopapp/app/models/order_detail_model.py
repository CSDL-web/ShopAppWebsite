from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class OrderDetail(Base):
    __tablename__ = "order_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    
    product_id = Column(Integer, ForeignKey("products.id"))
    
    price = Column(DECIMAL(10, 2))
    number_of_products = Column(Integer, default=1)
    total_money = Column(DECIMAL(10, 2), default=0.00)
    color = Column(String(20), default="")
    coupon_id = Column(Integer, ForeignKey("coupons.id"))

    # Relationships
    order = relationship("Order", back_populates="order_details")
    
    
    product = relationship("Product", back_populates="order_details")
    
    coupon = relationship("Coupon", back_populates="order_details")