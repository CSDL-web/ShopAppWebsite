from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.role_model import Role 

class RoleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, role_data: dict) -> Role:
        db_role = Role(**role_data) 
        
        self.db.add(db_role)
        self.db.commit()
        self.db.refresh(db_role) #lấy id về
        return db_role

    def get_by_id(self, role_id: int) -> Optional[Role]:
        return self.db.query(Role).filter(Role.id == role_id).first()

    def get_by_name(self, name: str) -> Optional[Role]:
        return self.db.query(Role).filter(Role.name == name).first()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Role]:
        return self.db.query(Role).offset(skip).limit(limit).all()

    def update(self, role_id: int, update_data: dict) -> Optional[Role]:
        db_role = self.get_by_id(role_id)
        if db_role:
            for key, value in update_data.items():
                setattr(db_role, key, value)
                
            self.db.commit()
            self.db.refresh(db_role)
            
        return db_role 

    def delete(self, role_id: int) -> Optional[Role]:
        db_role = self.get_by_id(role_id)
        
        if db_role:
            self.db.delete(db_role)
            self.db.commit()
            
        return db_role 