from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.order_detail_model import OrderDetail

class OrderDetailRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> OrderDetail:
        db_detail = OrderDetail(**data)
        self.db.add(db_detail)
        self.db.commit()
        self.db.refresh(db_detail)
        return db_detail

    def get_by_id(self, id: int) -> Optional[OrderDetail]:
        return self.db.query(OrderDetail).filter(OrderDetail.id == id).first()

    def get_by_order_id(self, order_id: int) -> List[OrderDetail]:
        """Lấy danh sách sản phẩm của một đơn hàng"""
        return self.db.query(OrderDetail).filter(OrderDetail.order_id == order_id).all()

    def update(self, update_data: dict) -> Optional[OrderDetail]:
        detail_id = update_data.get("id")
        db_detail = self.get_by_id(detail_id)
        if not db_detail:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(db_detail, key, value)

        self.db.commit()
        self.db.refresh(db_detail)
        return db_detail

    def delete(self, id: int) -> Optional[OrderDetail]:
        db_detail = self.get_by_id(id)
        if db_detail:
            self.db.delete(db_detail)
            self.db.commit()
        return db_detail