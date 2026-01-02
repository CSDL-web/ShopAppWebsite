from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.order_model import Order

class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, order_data: dict) -> Order:
        db_order = Order(**order_data)
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)
        return db_order

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def get_by_user_id(self, user_id: int) -> List[Order]:
        return self.db.query(Order).filter(Order.user_id == user_id).order_by(Order.order_date.desc()).all()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Order]:
        return self.db.query(Order).offset(skip).limit(limit).order_by(Order.order_date.desc()).all()

    def update(self, update_data: dict) -> Optional[Order]:
        order_id = update_data.get("id")
        db_order = self.get_by_id(order_id)
        if not db_order:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(db_order, key, value)

        self.db.commit()
        self.db.refresh(db_order)
        return db_order

    def delete(self, order_id: int) -> Optional[Order]:
        # Thường Order chỉ nên set active=False (Soft delete) thay vì xóa cứng
        db_order = self.get_by_id(order_id)
        if db_order:
            db_order.active = False # Soft delete logic
            # self.db.delete(db_order) # Nếu muốn hard delete thì uncomment dòng này
            self.db.commit()
        return db_order