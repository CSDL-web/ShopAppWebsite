from fastapi import  APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.dtos.userDto import UserDTO
from app.responses.userResponse import UserResponse
from app.services.userService import UserService
from app.configs.dbConfig import get_db

userRouter = APIRouter(prefix="/api/users", tags=["Users"])

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

@userRouter.get("/get_user", response_model=List[UserResponse])
def get_all_users(skip: int = 0, limit: int = 10, service: UserService = Depends(get_user_service)):
    return service.get_all_users(skip, limit)


@userRouter.get("/get_user_by_id/{id}", response_model=UserResponse)
def getUserById(id: int, service: UserService = Depends(get_user_service)):
    return service.get_users_by_id(id)

