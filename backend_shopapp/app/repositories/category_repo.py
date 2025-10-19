from sqlalchemy.orm import Session
from typing import Optional
from models import Category

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
        return self.db.query(Category).filter(Category.id == category_id).one()
    
    def get_by_name(self, name: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.name == name).one()
    
    def get_all(self, skip: int = 0, limit: int = 50) -> Optional[Category]:
        return self.db.query(Category).offset(skip).limit(limit).all()
    
    #Update
    def update(self, category_id: int, update_data: dict) -> Optional[Category]:
        #Tìm id trong bảng category:
        current_category = self.get_by_id(category_id)
        
        if current_category:
            for key, value in update_data.items():
                setattr(current_category, key, value)
            self.db.commit()
            self.db.refresh(current_category)
        
        return current_category
            
    #Delete
    def delete(self, category_id: int) -> Optional[Category]:
        db_category = self.get_by_id(category_id)
        if db_category:
            self.db.delete(db_category)
            self.db.commit()
        return db_category