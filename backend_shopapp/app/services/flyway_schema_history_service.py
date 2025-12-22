from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.repositories.flyway_schema_history_repo import FlywaySchemaHistoryRepository
from app.models.flyway_schema_history_model import FlywaySchemaHistory
from app.models.user_model import User

class FlywaySchemaHistoryService:
    def __init__(self, db: Session):
        self.repo = FlywaySchemaHistoryRepository(db)

    def get_all_history(self, skip: int, limit: int, current_user: User) -> List[FlywaySchemaHistory]:
        """
        Lấy danh sách lịch sử migration.
        Chỉ Admin mới có quyền xem thông tin nhạy cảm này của hệ thống.
        """
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin mới có quyền truy cập lịch sử migration."
            )
        return self.repo.get_all(skip, limit)

    def get_history_by_rank(self, rank: int, current_user: User) -> FlywaySchemaHistory:
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền truy cập."
            )
            
        history = self.repo.get_by_rank(rank)
        if not history:
            raise ValueError(f"Không tìm thấy migration với rank {rank}.")
        return history

    def get_history_by_version(self, version: str, current_user: User) -> FlywaySchemaHistory:
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền truy cập."
            )

        history = self.repo.get_by_version(version)
        if not history:
            raise ValueError(f"Không tìm thấy migration phiên bản {version}.")
        return history

    def delete_history_record(self, rank: int, current_user: User):
        """
        Xóa bản ghi lịch sử.
        Thường dùng để xóa các migration bị lỗi (success=0) để Flyway chạy lại.
        Cần rất cẩn trọng khi dùng hàm này.
        """
        if not current_user.role or current_user.role.name != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chỉ Admin tối cao mới được quyền can thiệp vào lịch sử migration."
            )

        # Lấy thông tin record trước khi xóa để kiểm tra
        history = self.repo.get_by_rank(rank)
        if not history:
            raise ValueError(f"Không tìm thấy migration rank {rank} để xóa.")

        return self.repo.delete(rank)