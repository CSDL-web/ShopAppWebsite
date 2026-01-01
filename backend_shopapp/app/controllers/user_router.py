from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.user_service import UserService
from app.services.auth_service import get_current_user
from app.models.user_model import User
from app.dtos.user_dto import UserDTO, UserRead
from app.dtos.user_login_dto import UserLoginDTO
from app.dtos.token_dto import RefreshTokenRequest
from app.dtos.facebook_login_dto import FacebookLoginDTO
from app.dtos.google_login_dto import GoogleLoginDTO

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
    return service.login_user(login_data)

@userRouter.post("/login-facebook")
def login_facebook(
    fb_data: FacebookLoginDTO,
    service: UserService = Depends(get_user_service)
):
    return service.login_facebook(fb_data)

@userRouter.post("/login-google-(add client gg id in .env)")
def login_google(
    google_data: GoogleLoginDTO,
    service: UserService = Depends(get_user_service)
):
    return service.login_google(google_data)

@userRouter.post("/refresh-token")
def refresh_token(
    request: RefreshTokenRequest,
    service: UserService = Depends(get_user_service)
):
    return service.refresh_access_token(request.refresh_token)

@userRouter.get("", response_model=List[UserRead])
def get_all_users(
    skip: int = 0,
    limit: int = 10,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return service.repo.get_users(skip, limit)

@userRouter.get("/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: int, service: UserService = Depends(get_user_service)):
    return service.get_user_by_id(user_id)
