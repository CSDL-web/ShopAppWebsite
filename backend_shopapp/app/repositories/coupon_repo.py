from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.coupon_model import Coupon

class CouponRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, coupon_data: dict) -> Coupon:
        # Kiểm tra trùng mã code trước khi tạo
        if self.get_by_code(coupon_data.get("code")):
            raise ValueError(f"Mã giảm giá '{coupon_data.get('code')}' đã tồn tại.")
            
        db_coupon = Coupon(**coupon_data)
        self.db.add(db_coupon)
        self.db.commit()
        self.db.refresh(db_coupon)
        return db_coupon

    def get_by_id(self, coupon_id: int) -> Optional[Coupon]:
        return self.db.query(Coupon).filter(Coupon.id == coupon_id).first()

    def get_by_code(self, code: str) -> Optional[Coupon]:
        return self.db.query(Coupon).filter(Coupon.code == code).first()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Coupon]:
        return self.db.query(Coupon).offset(skip).limit(limit).all()

    def update(self, update_data: dict) -> Optional[Coupon]:
        coupon_id = update_data.get("id")
        if not coupon_id:
            raise ValueError("Thiếu 'id' trong dữ liệu cập nhật")

        db_coupon = self.get_by_id(coupon_id)
        if not db_coupon:
            return None

        new_code = update_data.get("code")
        # Kiểm tra trùng code nếu có thay đổi code
        if new_code and new_code != db_coupon.code:
            existing = self.get_by_code(new_code)
            if existing:
                raise ValueError(f"Mã giảm giá '{new_code}' đã được sử dụng.")

        for key, value in update_data.items():
            if value is not None: # Chỉ update các trường có giá trị
                setattr(db_coupon, key, value)

        self.db.commit()
        self.db.refresh(db_coupon)
        return db_coupon

    def delete(self, coupon_id: int) -> Optional[Coupon]:
        db_coupon = self.get_by_id(coupon_id)
        if db_coupon:
            self.db.delete(db_coupon)
            self.db.commit()
        return db_coupon