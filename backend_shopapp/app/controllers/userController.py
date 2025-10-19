from fastapi import  Depends
from sqlalchemy.orm import Session
from typing import List
from app.dtos.userDto import UserDTO
from app.responses.userResponse import UserResponse
from app.services.userService import UserService
from app.configs.dbConfig import get_db
from app.controllers import userRouter


@userRouter.post("/create_user", response_model=UserResponse)
def create_user(user_dto: UserDTO, db: Session = Depends(get_db)):
    user = UserService.create_user(db, user_dto)
    return user

# @router.get("/get_db", response_model=List[UserResponse])
# def get_all_users(db: Session = Depends(get_db)):
#     return UserService.get_all_users(db)
