from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.favorite_service import FavoriteService
from app.dtos.favorite_dto import FavoriteCreate, FavoriteRead
from app.models.user_model import User
from app.services.auth_service import get_current_user

favorite_router = APIRouter(prefix="/favorites", tags=["Favorites"])

@favorite_router.post("", response_model=FavoriteRead)
def add_favorite(
    data: FavoriteCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = FavoriteService(db)
    if data.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không thể thao tác giùm người khác.")
    return service.add_favorite(data)

@favorite_router.get("", response_model=List[FavoriteRead])
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = FavoriteService(db)
    return service.get_favorites_by_user(current_user.id)

@favorite_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = FavoriteService(db)
    try:
        service.remove_favorite(id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))