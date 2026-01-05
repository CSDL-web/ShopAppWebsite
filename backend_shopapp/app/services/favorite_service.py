from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.favorite_repo import FavoriteRepository
from app.dtos.favorite_dto import FavoriteCreate
from app.models.favorite_model import Favorite
from app.models.user_model import User

class FavoriteService:
    def __init__(self, db: Session):
        self.repo = FavoriteRepository(db)

    def add_favorite(self, data: FavoriteCreate) -> Favorite:
        # Repo đã xử lý logic check duplicate (nếu đã like thì trả về cái cũ)
        return self.repo.create(data.model_dump())

    def get_favorites_by_user(self, user_id: int):
        return self.repo.get_by_user_id(user_id)

    def remove_favorite(self, favorite_id: int, current_user: User):
        favorite = self.repo.db.query(Favorite).filter(Favorite.id == favorite_id).first()
        if not favorite:
            raise ValueError(f"Không tìm thấy mục yêu thích ID {favorite_id}.")

        # Check quyền: Chính chủ hoặc Admin mới được xóa
        is_owner = favorite.user_id == current_user.id
        is_admin = current_user.role and current_user.role.name == 'admin'

        if not (is_owner or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền xóa mục yêu thích này."
            )

        return self.repo.delete(favorite_id)