from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from app.repositories.order_repo import OrderRepository
from app.dtos.order_dto import OrderCreate, OrderUpdate
from app.models.order_model import Order
from app.models.user_model import User

class OrderService:
    def __init__(self, db: Session):
        self.repo = OrderRepository(db)

    def create_order(self, order_data: OrderCreate) -> Order:
        # Có thể thêm logic tính toán tổng tiền từ OrderDetail tại đây nếu cần
        return self.repo.create(order_data.model_dump())

    def get_order_by_id(self, order_id: int) -> Order:
        order = self.repo.get_by_id(order_id)
        if not order:
            raise ValueError(f"Không tìm thấy đơn hàng ID {order_id}.")
        return order

    def get_orders_by_user(self, user_id: int, current_user: User) -> List[Order]:
        # Check quyền: User chỉ xem đơn của mình, Admin xem được của bất kỳ ai
        is_owner = user_id == current_user.id
        is_admin = current_user.role and current_user.role.name == 'admin'

        if not (is_owner or is_admin):
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền xem lịch sử đơn hàng của người khác."
            )
        return self.repo.get_by_user_id(user_id)

    def get_all_orders(self, skip: int, limit: int, current_user: User):
        # Chỉ Admin mới được lấy toàn bộ danh sách đơn hàng hệ thống
        if not current_user.role or current_user.role.name != 'admin':
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin mới có quyền truy cập danh sách toàn bộ đơn hàng."
            )
        return self.repo.get_all(skip, limit)

    def update_order(self, update_data: OrderUpdate, current_user: User) -> Order:
        # Logic update phức tạp có thể nằm ở đây (vd: check trạng thái cũ trước khi đổi trạng thái mới)
        # Tạm thời cho phép update các trường trong DTO
        
        # Check quyền update nếu cần (ví dụ user chỉ được hủy đơn khi còn pending)
        order = self.repo.get_by_id(update_data.id)
        if not order:
             raise ValueError(f"Không tìm thấy đơn hàng ID {update_data.id}.")
             
        # Ví dụ: Nếu user thường muốn update (vd hủy đơn), cần check owner
        # Nếu là admin thì thoải mái
        
        return self.repo.update(update_data.model_dump(exclude_unset=True))

    def delete_order(self, order_id: int, current_user: User):
        # Soft delete
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin mới được xóa đơn hàng."
            )
            
        order = self.repo.delete(order_id)
        if not order:
            raise ValueError(f"Không tìm thấy đơn hàng ID {order_id} để xóa.")
        return order