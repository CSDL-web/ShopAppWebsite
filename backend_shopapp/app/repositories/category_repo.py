from sqlalchemy.orm import Session
from typing import Optional
from app.models.category_model import Category

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    #Create 
    def create(self, category_data: dict) -> Category:
        db_category = Category(**category_data) #giải nén dict
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    #Read
    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def get_by_name(self, name: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.name == name).first()
    
    def get_all(self, skip: int = 0, limit: int = 50) -> Optional[Category]:
        return self.db.query(Category).offset(skip).limit(limit).all()
    
    #Update
    def update(self, update_data: dict) -> Optional[Category]:
        category_id = update_data.get("id")
        if not category_id:
            raise ValueError("Thiếu 'id' trong dữ liệu cập nhật")

        db_category = self.get_by_id(category_id)
        if not db_category:
            return None

        new_name = update_data.get("name")
        if new_name and new_name != db_category.name:
            existing = self.get_by_name(new_name)
            if existing:
                raise ValueError(f"Tên '{new_name}' đã được sử dụng.")

        for key, value in update_data.items():
            setattr(db_category, key, value)

        self.db.commit()
        self.db.refresh(db_category)
        return db_category
            
    #Delete
    def delete(self, category_id: int) -> Optional[Category]:
        db_category = self.get_by_id(category_id)
        if db_category:
            self.db.delete(db_category)
            self.db.commit()
        return db_category