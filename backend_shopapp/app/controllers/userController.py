from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dtos.userDto import UserDTO
from responses.userResponse import UserResponse
from services.userService import UserService
from configs.dbConfig import get_db
from typing import List

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/create_user", response_model=UserResponse)
def create_user(user_dto: UserDTO, db: Session = Depends(get_db)):
    user = UserService.create_user(db, user_dto)
    return user

# @router.get("/get_db", response_model=List[UserResponse])
# def get_all_users(db: Session = Depends(get_db)):
#     return UserService.get_all_users(db)
