from sqlalchemy import Column, Integer, String, DateTime, Date, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.configs.dbConfig import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    fullname = Column(String(100), default="")
    email = Column(String(100), default="")
    phone_number = Column(String(20), nullable=False)
    address = Column(String(200), nullable=False)
    note = Column(String(100), default="")
    order_date = Column(DateTime, default=func.now())
    
    # Mapping Enum từ SQL
    status = Column(Enum('pending', 'processing', 'shipped', 'delivered', 'cancelled', name="status_enum"))
    
    
    total_money = Column(Float, nullable=True)
    
    shipping_method = Column(String(100))
    shipping_address = Column(String(200))
    shipping_date = Column(Date)
    tracking_number = Column(String(100))
    payment_method = Column(String(100))
    active = Column(Boolean, default=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id"))

    # Relationships
    user = relationship("User", back_populates="orders") # Cần thêm orders vào User model
    coupon = relationship("Coupon", back_populates="orders")
    order_details = relationship("OrderDetail", back_populates="order")