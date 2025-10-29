from sqlalchemy.orm import Session,joinedload
from typing import Optional
from app.models.user_model import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_users(self, skip: int = 0, limit: int = 10):
        return (
            self.db.query(User)
            .options(joinedload(User.role)) 
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_user_by_id(self, id: int)-> Optional[User]:
        return self.db.query(User).filter(User.id == id).options(joinedload(User.role)).one()