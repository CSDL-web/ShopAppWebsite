from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.coupon_condition_model import CouponCondition

class CouponConditionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> CouponCondition:
        db_item = CouponCondition(**data)
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def get_by_id(self, condition_id: int) -> Optional[CouponCondition]:
        return self.db.query(CouponCondition).filter(CouponCondition.id == condition_id).first()

    def get_by_coupon_id(self, coupon_id: int) -> List[CouponCondition]:
        """Lấy tất cả điều kiện của một mã giảm giá"""
        return self.db.query(CouponCondition).filter(CouponCondition.coupon_id == coupon_id).all()

    def update(self, update_data: dict) -> Optional[CouponCondition]:
        condition_id = update_data.get("id")
        db_item = self.get_by_id(condition_id)
        if not db_item:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(db_item, key, value)

        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def delete(self, condition_id: int) -> Optional[CouponCondition]:
        db_item = self.get_by_id(condition_id)
        if db_item:
            self.db.delete(db_item)
            self.db.commit()
        return db_item