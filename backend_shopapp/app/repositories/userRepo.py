from sqlalchemy.orm import Session
from typing import Optional
from models import User

# check nếu tồn tại user theo số điện thoại
def exists_by_phone_number(db: Session, phone_number: str) -> bool:
    return db.query(User).filter(User.phone_number == phone_number).first() is not None

# tìm user theo số điện thoại
def find_by_phone_number(db: Session, phone_number: str) -> Optional[User]:
    return db.query(User).filter(User.phone_number == phone_number).first()

# danh sách user có phân trang
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()
