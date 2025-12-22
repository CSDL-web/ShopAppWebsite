from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.coupon_condition_service import CouponConditionService
from app.dtos.coupon_condition_dto import CouponConditionCreate, CouponConditionUpdate, CouponConditionRead
from app.models.user_model import User
from app.controllers.user_router import get_current_user

coupon_condition_router = APIRouter(prefix="/coupon-conditions", tags=["Coupon Conditions"])

@coupon_condition_router.post("", response_model=CouponConditionRead, status_code=status.HTTP_201_CREATED)
def create_condition(
    data: CouponConditionCreate, 
    db: Session = Depends(get_db)
):
    service = CouponConditionService(db)
    return service.create_condition(data)

@coupon_condition_router.get("/coupon/{coupon_id}", response_model=List[CouponConditionRead])
def get_conditions_by_coupon(coupon_id: int, db: Session = Depends(get_db)):
    service = CouponConditionService(db)
    return service.get_conditions_by_coupon(coupon_id)

@coupon_condition_router.put("/{condition_id}", response_model=CouponConditionRead)
def update_condition(
    condition_id: int,
    data: CouponConditionUpdate,
    db: Session = Depends(get_db)
):
    service = CouponConditionService(db)
    data.id = condition_id
    try:
        return service.update_condition(data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@coupon_condition_router.delete("/{condition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_condition(
    condition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CouponConditionService(db)
    try:
        service.delete_condition(condition_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))