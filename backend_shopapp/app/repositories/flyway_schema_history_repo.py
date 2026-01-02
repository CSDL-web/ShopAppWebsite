from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.flyway_schema_history_model import FlywaySchemaHistory

class FlywaySchemaHistoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_rank(self, rank: int) -> Optional[FlywaySchemaHistory]:
        """Lấy thông tin migration theo thứ tự cài đặt (PK)"""
        return self.db.query(FlywaySchemaHistory).filter(FlywaySchemaHistory.installed_rank == rank).first()

    def get_by_version(self, version: str) -> Optional[FlywaySchemaHistory]:
        """Tìm migration theo phiên bản"""
        return self.db.query(FlywaySchemaHistory).filter(FlywaySchemaHistory.version == version).first()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[FlywaySchemaHistory]:
        """Lấy danh sách lịch sử migration, sắp xếp mới nhất trước"""
        return self.db.query(FlywaySchemaHistory).order_by(FlywaySchemaHistory.installed_rank.desc()).offset(skip).limit(limit).all()

    def create(self, data: dict) -> FlywaySchemaHistory:
        """
        Lưu ý: Thường Flyway tự tạo record này. 
        Hàm này chỉ dùng nếu bạn muốn can thiệp thủ công (không khuyến khích).
        """
        db_history = FlywaySchemaHistory(**data)
        self.db.add(db_history)
        self.db.commit()
        self.db.refresh(db_history)
        return db_history

    def delete(self, rank: int) -> Optional[FlywaySchemaHistory]:
        """Xóa record migration bị lỗi (success=0) để chạy lại"""
        db_history = self.get_by_rank(rank)
        if db_history:
            self.db.delete(db_history)
            self.db.commit()
        return db_history