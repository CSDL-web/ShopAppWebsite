from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.order_detail_service import OrderDetailService
from app.dtos.order_detail_dto import OrderDetailCreate, OrderDetailUpdate, OrderDetailRead
from app.models.user_model import User
from app.controllers.user_router import get_current_user

order_detail_router = APIRouter(prefix="/order-details", tags=["Order Details"])

@order_detail_router.post("", response_model=OrderDetailRead)
def add_order_detail(data: OrderDetailCreate, db: Session = Depends(get_db)):
    service = OrderDetailService(db)
    return service.create_order_detail(data)

@order_detail_router.get("/order/{order_id}", response_model=List[OrderDetailRead])
def get_details_by_order(order_id: int, db: Session = Depends(get_db)):
    service = OrderDetailService(db)
    return service.get_details_by_order(order_id)

@order_detail_router.put("/{detail_id}", response_model=OrderDetailRead)
def update_detail(
    detail_id: int,
    data: OrderDetailUpdate,
    db: Session = Depends(get_db)
):
    service = OrderDetailService(db)
    data.id = detail_id
    try:
        return service.update_detail(data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@order_detail_router.delete("/{detail_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_detail(
    detail_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrderDetailService(db)
    try:
        service.delete_detail(detail_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))