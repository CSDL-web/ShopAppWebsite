from app.models.role_model import Role
from sqlalchemy.orm import Session

class RoleService:
    def get_all_roles(self, db: Session):
        return db.query(Role).all()