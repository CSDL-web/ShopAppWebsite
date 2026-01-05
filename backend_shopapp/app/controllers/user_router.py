from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.user_service import UserService
from app.services.auth_service import get_current_user
from app.models.user_model import User
from app.dtos.user_dto import UserDTO, UserRead, UserUpdateProfileDTO, ChangePasswordDTO 
from app.dtos.user_login_dto import UserLoginDTO
from app.dtos.token_dto import RefreshTokenRequest
from app.dtos.facebook_login_dto import FacebookLoginDTO
from app.dtos.google_login_dto import GoogleLoginDTO

userRouter = APIRouter(prefix="/users", tags=["Users"])

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)



@userRouter.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_data: UserDTO, service: UserService = Depends(get_user_service)):
    """role_id: 1 nếu là user, 2 nếu là admin"""
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
    """Cần phải có token từ sdk facebook"""
    return service.login_facebook(fb_data)

@userRouter.post("/login-google")
def login_google(
    google_data: GoogleLoginDTO,
    service: UserService = Depends(get_user_service)
):
    """Phải set up client id trên gg cloud console và cập nhật .env"""
    return service.login_google(google_data)

@userRouter.post("/refresh-token")
def refresh_token(
    request: RefreshTokenRequest,
    service: UserService = Depends(get_user_service)
):
    return service.refresh_access_token(request.refresh_token)



@userRouter.put("/details", response_model=UserRead)
def update_my_profile(
    update_data: UserUpdateProfileDTO,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    # current_user.id đảm bảo user chỉ sửa được chính mình
    return service.update_user_profile(current_user.id, update_data)

@userRouter.put("/password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: ChangePasswordDTO,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    return service.change_password(current_user.id, password_data)


@userRouter.put("/admin/block/{user_id}/{active}", response_model=UserRead)
def block_unblock_user(
    user_id: int,
    active: int, # Truyền 1 (True) hoặc 0 (False)
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    if not current_user.role or current_user.role.name != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Bạn không có quyền thực hiện thao tác này"
        )
    
    is_active_bool = True if active == 1 else False
    return service.admin_update_user_status(user_id, is_active_bool)

@userRouter.delete("/admin/delete/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user)
):
    """chỉ delete được user nếu người đó chưa có bất kì giao dịch nào trên hệ thống"""
    if not current_user.role or current_user.role.name != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Bạn không có quyền xóa người dùng."
        )
    
    try:
        service.delete_user(current_user.id, user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể xóa: Dữ liệu ràng buộc vẫn còn ({str(e)})")
        
    return None



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