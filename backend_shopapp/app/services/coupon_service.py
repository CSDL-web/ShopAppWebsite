from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.coupon_repo import CouponRepository
from app.dtos.coupon_dto import CouponCreate, CouponUpdate
from app.models.coupon_model import Coupon
from app.models.user_model import User

class CouponService:
    def __init__(self, db: Session):
        self.repo = CouponRepository(db)

    def create_coupon(self, coupon_data: CouponCreate) -> Coupon:
        existing_coupon = self.repo.get_by_code(coupon_data.code)
        if existing_coupon:
            raise ValueError(f"Mã giảm giá '{coupon_data.code}' đã tồn tại.")
        
        return self.repo.create(coupon_data.model_dump())

    def get_coupon_by_id(self, coupon_id: int) -> Coupon:
        coupon = self.repo.get_by_id(coupon_id)
        if not coupon:
            raise ValueError(f"Không tìm thấy mã giảm giá với ID {coupon_id}.")
        return coupon

    def get_all_coupons(self, skip: int, limit: int):
        return self.repo.get_all(skip, limit)

    def update_coupon(self, update_data: CouponUpdate) -> Coupon:
        # Repository đã handle việc check trùng code khi update
        try:
            coupon = self.repo.update(update_data.model_dump(exclude_unset=True))
            if not coupon:
                raise ValueError(f"Không tìm thấy mã giảm giá với ID {update_data.id}.")
            return coupon
        except ValueError as e:
            raise ValueError(str(e)) # Re-raise lỗi từ Repo

    def delete_coupon(self, coupon_id: int, current_user: User):
        # Chỉ Admin mới được xóa Coupon
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền xóa mã giảm giá."
            )
        
        coupon = self.repo.delete(coupon_id)
        if not coupon:
             raise ValueError(f"Không tìm thấy mã giảm giá ID {coupon_id} để xóa.")
        return coupon