from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import User
# from models.roleModel import Role
# from dtos.userDto import UserDTO 
from app.repositories.userRepo import UserRepository

class UserService:
    def __init__(self, db: Session):
        self.userRepo = UserRepository(db)

    def get_all_users(self, skip: int, limit: int):
        user = self.userRepo.get_users(skip, limit)
        return user
    
    def get_users_by_id(self, id: int) -> User:
        user = self.userRepo.get_user_by_id(id)
        if not user:
            raise ValueError(f"Không tìm thấy danh mục với ID {id}.")
        return user