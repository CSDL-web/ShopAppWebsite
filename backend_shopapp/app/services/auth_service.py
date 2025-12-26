# File: app/services/auth_service.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.configs.dbConfig import get_db # Giả sử bạn có hàm này
from app.configs.security import SECRET_KEY, ALGORITHM
from app.repositories.user_repo import UserRepository
from app.models.user_model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login") # Đường dẫn API login

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực thông tin đăng nhập",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone_number: str = payload.get("sub")
        if phone_number is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    repo = UserRepository(db)
    user = repo.get_by_phone_number(phone_number)
    if user is None:
        raise credentials_exception
    return user