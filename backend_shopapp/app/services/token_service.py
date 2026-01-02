# File: app/services/token_service.py
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError # Cần cài: pip install python-jose[cryptography]
from app.models.user_model import User
from app.configs.security import SECRET_KEY, ALGORITHM # Bạn cần tạo file config này hoặc define tạm

# Cấu hình tạm nếu chưa có file config
# SECRET_KEY = "your_super_secret_key"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

class TokenService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=30) # Default 30p
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=7) # Refresh token sống 7 ngày
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt