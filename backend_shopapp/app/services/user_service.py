# File: app/services/user_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext # Cần cài: pip install passlib[bcrypt]

from app.models.user_model import User
from app.repositories.user_repo import UserRepository
from app.dtos.user_dto import UserDTO
from app.dtos.user_login_dto import UserLoginDTO
from app.services.token_service import TokenService

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register_user(self, user_dto: UserDTO) -> User:
        # 1. Check trùng SĐT
        if self.repo.exists_by_phone(user_dto.phone_number):
            raise HTTPException(status_code=400, detail="Số điện thoại đã tồn tại")

        # 2. Hash mật khẩu
        hashed_password = pwd_context.hash(user_dto.password)
        
        # 3. Chuyển DTO sang dict và thay password
        user_data = user_dto.model_dump()
        user_data['password'] = hashed_password
        
        # Mặc định role_id = 1 (User) nếu không truyền
        if 'role_id' not in user_data or not user_data['role_id']:
             user_data['role_id'] = 1 

        return self.repo.create(user_data)

    def login_user(self, login_dto: UserLoginDTO):
        # 1. Tìm user
        user = self.repo.get_by_phone_number(login_dto.phone_number)
        if not user:
            raise HTTPException(status_code=400, detail="Số điện thoại hoặc mật khẩu không đúng")

        # 2. Check password
        if not pwd_context.verify(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail="Số điện thoại hoặc mật khẩu không đúng")

        if not user.is_active:
             raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

        # 3. Tạo Token
        access_token = TokenService.create_access_token(data={"sub": user.phone_number, "id": user.id, "role_id": user.role_id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user # Trả thêm info user nếu cần
        }

    def get_user_by_id(self, user_id: int) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        return user