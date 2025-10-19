from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.schema import User
# from models.roleModel import Role
from dtos.userLoginDto import UserLoginDTO
# from dtos.userDto import UserDTO 
from repositories.userRepo import exists_by_phone_number, find_by_phone_number

class UserService:

    # @staticmethod
    # def create_user(db: Session, user_dto: UserDTO) -> User:
    #     if exists_by_phone_number(db, user_dto.phone_number):
    #         raise HTTPException(status_code=400, detail="Phone number already exists")

    #     role = db.query(Role).filter(Role.id == user_dto.role_id).first()
    #     if not role:
    #         raise HTTPException(status_code=404, detail="Role not found")

    #     new_user = User(
    #         full_name=user_dto.full_name,
    #         phone_number=user_dto.phone_number,
    #         password=user_dto.password,  # TODO: hash password
    #         address=user_dto.address,
    #         date_of_birth=user_dto.date_of_birth,
    #         facebook_account_id=user_dto.facebook_account_id,
    #         google_account_id=user_dto.google_account_id,
    #         role=role,
    #     )
    #     db.add(new_user)
    #     db.commit()
    #     db.refresh(new_user)
    #     return new_user

    @staticmethod
    def get_all_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def login_user(db: Session, login_dto: UserLoginDTO) -> User:
        user = find_by_phone_number(db, login_dto.phone_number)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.password != login_dto.password:  # TODO: hash verify
            raise HTTPException(status_code=401, detail="Invalid password")
        return user
