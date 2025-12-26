from sqlalchemy.orm import Session
from typing import Optional
from app.models.user_model import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_data: dict) -> User:
        # Tạo user mới từ dictionary
        db_user = User(**user_data)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_phone_number(self, phone_number: str) -> Optional[User]:
        # Cần thiết cho chức năng Đăng nhập
        return self.db.query(User).filter(User.phone_number == phone_number).first()
    
    def exists_by_phone(self, phone_number: str) -> bool:
        # Kiểm tra trùng số điện thoại khi đăng ký
        return self.db.query(User).filter(User.phone_number == phone_number).first() is not None

    def update(self, user_id: int, update_data: dict) -> Optional[User]:
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(db_user, key, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user