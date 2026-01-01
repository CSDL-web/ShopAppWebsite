import hashlib
import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user_model import User
from app.repositories.user_repo import UserRepository
from app.repositories.token_repo import TokenRepository
from app.dtos.user_dto import UserDTO
from app.dtos.user_login_dto import UserLoginDTO
from app.services.token_service import TokenService

class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)
        self.token_repo = TokenRepository(db)

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
        if user_dto.phone_number:
            if self.repo.exists_by_phone(user_dto.phone_number):
                raise HTTPException(status_code=400, detail="Số điện thoại đã tồn tại")

        if user_dto.email:
            if self.repo.exists_by_email(user_dto.email):
                raise HTTPException(status_code=400, detail="Email đã tồn tại")

        hashed_password = self._hash_password(user_dto.password)

        user_data = user_dto.model_dump()
        user_data['password'] = hashed_password

        if 'role_id' not in user_data or not user_data['role_id']:
            user_data['role_id'] = 1

        return self.repo.create(user_data)

    def login_user(self, login_dto: UserLoginDTO):
        account_input = login_dto.account
        user = None

        if "@" in account_input:
            user = self.repo.get_by_email(account_input)
        else:
            user = self.repo.get_by_phone_number(account_input)

        if not user:
            raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không đúng")

        if not self._verify_password(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail="Tài khoản hoặc mật khẩu không đúng")

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

        sub_identifier = user.phone_number if user.phone_number else user.email

        access_token_expires = timedelta(minutes=30)
        access_token = TokenService.create_access_token(
            data={"sub": sub_identifier, "id": user.id, "role_id": user.role_id},
            expires_delta=access_token_expires
        )

        refresh_token_expires = timedelta(days=7)
        refresh_token = TokenService.create_refresh_token(
            data={"sub": sub_identifier, "id": user.id},
            expires_delta=refresh_token_expires
        )

        self.token_repo.create({
            "token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user_id": user.id,
            "expiration_date": datetime.now() + access_token_expires,
            "refresh_expiration_date": datetime.now() + refresh_token_expires,
            "revoked": False,
            "expired": False,
            "is_mobile": False
        })

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user
        }

    def refresh_access_token(self, refresh_token_str: str):
        stored_token = self.token_repo.get_by_refresh_token(refresh_token_str)

        if not stored_token:
            raise HTTPException(status_code=400, detail="Refresh token không tồn tại")

        if stored_token.revoked:
            raise HTTPException(status_code=401, detail="Token đã bị thu hồi")

        if stored_token.refresh_expiration_date < datetime.now():
            stored_token.expired = True
            self.token_repo.save(stored_token)
            raise HTTPException(status_code=401, detail="Refresh token đã hết hạn")

        user = self.repo.get_by_id(stored_token.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User không tồn tại")

        sub_identifier = user.phone_number if user.phone_number else user.email

        new_access_token = TokenService.create_access_token(
            data={"sub": sub_identifier, "id": user.id, "role_id": user.role_id}
        )

        stored_token.token = new_access_token
        stored_token.expiration_date = datetime.now() + timedelta(minutes=30)
        self.token_repo.save(stored_token)

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    def get_all_users(self, skip: int, limit: int):
        return self.repo.db.query(User).offset(skip).limit(limit).all()

    def get_user_by_id(self, user_id: int):
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
        return user
