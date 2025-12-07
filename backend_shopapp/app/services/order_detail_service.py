from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.order_detail_repo import OrderDetailRepository
from app.dtos.order_detail_dto import OrderDetailCreate, OrderDetailUpdate
from app.models.order_detail_model import OrderDetail
from app.models.user_model import User

class OrderDetailService:
    def __init__(self, db: Session):
        self.repo = OrderDetailRepository(db)

    def create_order_detail(self, data: OrderDetailCreate) -> OrderDetail:
        return self.repo.create(data.model_dump())

    def get_details_by_order(self, order_id: int) -> list[OrderDetail]:
        return self.repo.get_by_order_id(order_id)

    def update_detail(self, update_data: OrderDetailUpdate) -> OrderDetail:
        detail = self.repo.update(update_data.model_dump(exclude_unset=True))
        if not detail:
            raise ValueError(f"Không tìm thấy chi tiết đơn hàng ID {update_data.id}.")
        return detail

    def delete_detail(self, detail_id: int, current_user: User):
        if not current_user.role or current_user.role.name != 'admin':
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin mới được xóa chi tiết đơn hàng."
            )
            
        detail = self.repo.delete(detail_id)
        if not detail:
            raise ValueError(f"Không tìm thấy chi tiết đơn hàng ID {detail_id} để xóa.")
        return detail