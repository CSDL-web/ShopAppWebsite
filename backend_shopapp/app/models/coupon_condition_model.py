from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class CouponCondition(Base):
    __tablename__ = "coupon_conditions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=False)
    attribute = Column(String(255), nullable=False)
    operator = Column(String(10), nullable=False)
    value = Column(String(255), nullable=False)
    discount_amount = Column(DECIMAL(5, 2), nullable=False)

    # Relationships
    coupon = relationship("Coupon", back_populates="conditions")