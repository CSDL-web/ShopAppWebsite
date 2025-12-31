import hashlib
import bcrypt
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user_model import User
from app.repositories.user_repo import UserRepository
from app.dtos.user_dto import UserDTO
from app.dtos.user_login_dto import UserLoginDTO
from app.services.token_service import TokenService

class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def _hash_password(self, password: str) -> str:
        sha256_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        hashed_bytes = bcrypt.hashpw(sha256_hash.encode('utf-8'), bcrypt.gensalt())
        return hashed_bytes.decode('utf-8')

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        sha256_hash = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
        try:
            return bcrypt.checkpw(
                sha256_hash.encode('utf-8'),
                hashed_password.encode('utf-8')
            )
        except Exception:
            return False

    def register_user(self, user_dto: UserDTO) -> User:
        if self.repo.exists_by_phone(user_dto.phone_number):
            raise HTTPException(status_code=400, detail="Số điện thoại đã tồn tại")

        hashed_password = self._hash_password(user_dto.password)

        user_data = user_dto.model_dump()
        user_data['password'] = hashed_password

        if 'role_id' not in user_data or not user_data['role_id']:
            user_data['role_id'] = 1

        return self.repo.create(user_data)

    def login_user(self, login_dto: UserLoginDTO):
        user = self.repo.get_by_phone_number(login_dto.phone_number)
        if not user:
            raise HTTPException(status_code=400, detail="Số điện thoại hoặc mật khẩu không đúng")

        if not self._verify_password(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail="Số điện thoại hoặc mật khẩu không đúng")

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

        access_token = TokenService.create_access_token(
            data={
                "sub": user.phone_number,
                "id": user.id,
                "role_id": user.role_id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }

    def get_all_users(self, skip: int, limit: int):
        return self.repo.db.query(User).offset(skip).limit(limit).all()
