from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.order_service import OrderService
from app.dtos.order_dto import OrderCreate, OrderUpdate, OrderRead
from app.models.user_model import User

from app.services.auth_service import get_current_user

order_router = APIRouter(prefix="/orders", tags=["Orders"])

@order_router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    service = OrderService(db)
    return service.create_order(order_data)

@order_router.get("/me", response_model=List[OrderRead])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách đơn hàng của chính user đang login"""
    service = OrderService(db)
    return service.get_orders_by_user(current_user.id, current_user)

@order_router.get("/{order_id}", response_model=OrderRead)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    service = OrderService(db)
    try:
        return service.get_order_by_id(order_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@order_router.put("/{order_id}", response_model=OrderRead)
def update_order(
    order_id: int,
    update_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrderService(db)
    update_data.id = order_id
    try:
        return service.update_order(update_data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@order_router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrderService(db)
    try:
        service.delete_order(order_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@order_router.get("/get-all-orders-admin", response_model=List[OrderRead])
def get_all_orders_admin(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrderService(db)
    return service.get_all_orders(skip, limit, current_user)