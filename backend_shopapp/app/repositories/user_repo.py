from sqlalchemy.orm import Session
from typing import Optional
from app.models.user_model import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_data: dict) -> User:
        db_user = User(**user_data)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_phone_number(self, phone_number: str) -> Optional[User]:
        return self.db.query(User).filter(User.phone_number == phone_number).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    # [MỚI THÊM] Hàm tìm user bằng Facebook ID
    def get_by_facebook_id(self, facebook_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.facebook_account_id == facebook_id).first()

    def exists_by_phone(self, phone_number: str) -> bool:
        return self.db.query(User).filter(User.phone_number == phone_number).first() is not None

    def exists_by_email(self, email: str) -> bool:
        return self.db.query(User).filter(User.email == email).first() is not None

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

    def get_users(self, skip: int = 0, limit: int = 10):
        return self.db.query(User).offset(skip).limit(limit).all()