# File: app/controllers/user_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.user_service import UserService
from app.dtos.user_dto import UserDTO, UserRead 
from app.dtos.user_login_dto import UserLoginDTO 
# from app.dtos.token_dto import TokenDTO # (Optional) Dùng để type hint response login

userRouter = APIRouter(prefix="/users", tags=["Users"])

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

@userRouter.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_data: UserDTO, service: UserService = Depends(get_user_service)):
    try:
        return service.register_user(user_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@userRouter.post("/login")
def login(login_data: UserLoginDTO, service: UserService = Depends(get_user_service)):
    # Trả về Access Token
    return service.login_user(login_data)

@userRouter.get("", response_model=List[UserRead])
def get_all_users(skip: int = 0, limit: int = 10, service: UserService = Depends(get_user_service)):
    return service.repo.get_users(skip, limit) # Lưu ý: Repo cần có hàm get_users hoặc dùng service

@userRouter.get("/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: int, service: UserService = Depends(get_user_service)):
    return service.get_user_by_id(user_id)