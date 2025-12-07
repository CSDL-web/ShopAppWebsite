from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.favorite_model import Favorite

class FavoriteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> Favorite:
        # Kiểm tra xem đã favorite chưa để tránh duplicate
        existing = self.db.query(Favorite).filter(
            Favorite.user_id == data.get('user_id'),
            Favorite.product_id == data.get('product_id')
        ).first()
        
        if existing:
            return existing

        db_fav = Favorite(**data)
        self.db.add(db_fav)
        self.db.commit()
        self.db.refresh(db_fav)
        return db_fav

    def get_by_user_id(self, user_id: int) -> List[Favorite]:
        return self.db.query(Favorite).filter(Favorite.user_id == user_id).all()

    def delete(self, id: int) -> Optional[Favorite]:
        db_fav = self.db.query(Favorite).filter(Favorite.id == id).first()
        if db_fav:
            self.db.delete(db_fav)
            self.db.commit()
        return db_fav