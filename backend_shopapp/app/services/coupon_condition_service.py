from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.coupon_condition_repo import CouponConditionRepository
from app.dtos.coupon_condition_dto import CouponConditionCreate, CouponConditionUpdate
from app.models.coupon_condition_model import CouponCondition
from app.models.user_model import User

class CouponConditionService:
    def __init__(self, db: Session):
        self.repo = CouponConditionRepository(db)

    def create_condition(self, data: CouponConditionCreate) -> CouponCondition:
        return self.repo.create(data.model_dump())

    def get_conditions_by_coupon(self, coupon_id: int):
        return self.repo.get_by_coupon_id(coupon_id)

    def update_condition(self, update_data: CouponConditionUpdate) -> CouponCondition:
        condition = self.repo.update(update_data.model_dump(exclude_unset=True))
        if not condition:
            raise ValueError(f"Không tìm thấy điều kiện với ID {update_data.id}.")
        return condition

    def delete_condition(self, condition_id: int, current_user: User):
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin mới được xóa điều kiện giảm giá."
            )
            
        condition = self.repo.delete(condition_id)
        if not condition:
            raise ValueError(f"Không tìm thấy điều kiện ID {condition_id} để xóa.")
        return condition