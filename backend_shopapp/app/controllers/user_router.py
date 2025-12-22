from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.userService import UserService
from app.dtos.userDto import UserRead as UserResponse

userRouter = APIRouter(prefix="/api/users", tags=["Users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

def get_current_user(db: Session = Depends(get_db)):
    service = UserService(db)
    
    # 1. Thử lấy user ID 1 trong DB 
    try:
        user = service.get_user_by_id(1)
        if user:
            return user
    except Exception:
        pass 

    # 2. Nếu DB lỗi hoặc chưa có user, tạo User giả quyền Admin để trả về
    class FakeRole:
        name = "admin"

    class FakeUser:
        id = 1
        full_name = "System Admin (Fake)"
        role = FakeRole()
        role_id = 1
    
    return FakeUser()

@userRouter.get("/get_user", response_model=List[UserResponse])
def get_all_users(skip: int = 0, limit: int = 10, service: UserService = Depends(get_user_service)):
    return service.get_all_users(skip, limit)

@userRouter.get("/get_user_by_id/{id}", response_model=UserResponse)
def getUserById(id: int, service: UserService = Depends(get_user_service)):
    return service.get_user_by_id(id)