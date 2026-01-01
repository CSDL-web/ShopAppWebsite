from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.configs.dbConfig import get_db
from app.configs.security import SECRET_KEY, ALGORITHM
from app.repositories.user_repo import UserRepository
from app.models.user_model import User

security = HTTPBearer()

def get_current_user(
    token_obj: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = token_obj.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực thông tin đăng nhập",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub_data = payload.get("sub")
        if sub_data is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    repo = UserRepository(db)

    user = repo.get_by_phone_number(sub_data)

    if not user:
        user = repo.get_by_email(sub_data)

    if not user:
        user = repo.get_by_facebook_id(sub_data)

    if not user:
        raise credentials_exception

    return user
