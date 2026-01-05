from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), nullable=False, unique=True)
    active = Column(Boolean, nullable=False, default=True)

    # Relationships
    conditions = relationship("CouponCondition", back_populates="coupon")
    orders = relationship("Order", back_populates="coupon")
    order_details = relationship("OrderDetail", back_populates="coupon")