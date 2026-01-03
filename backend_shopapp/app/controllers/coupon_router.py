from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.coupon_service import CouponService
from app.dtos.coupon_dto import CouponCreate, CouponUpdate, CouponRead
from app.models.user_model import User
from app.services.auth_service import get_current_user 

coupon_router = APIRouter(prefix="/coupons", tags=["Coupons"])

@coupon_router.post("", response_model=CouponRead, status_code=status.HTTP_201_CREATED)
def create_coupon(coupon_data: CouponCreate, db: Session = Depends(get_db)):
    service = CouponService(db)
    try:
        return service.create_coupon(coupon_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@coupon_router.get("", response_model=List[CouponRead])
def get_all_coupons(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    service = CouponService(db)
    return service.get_all_coupons(skip, limit)

@coupon_router.get("/{coupon_id}", response_model=CouponRead)
def get_coupon(coupon_id: int, db: Session = Depends(get_db)):
    service = CouponService(db)
    try:
        return service.get_coupon_by_id(coupon_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@coupon_router.put("/{coupon_id}", response_model=CouponRead)
def update_coupon(coupon_id: int, coupon_data: CouponUpdate, db: Session = Depends(get_db)):
    service = CouponService(db)
    coupon_data.id = coupon_id
    try:
        return service.update_coupon(coupon_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@coupon_router.delete("/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coupon(coupon_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = CouponService(db)
    try:
        service.delete_coupon(coupon_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))