# File: app/controllers/role_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.role_service import RoleService 
from app.dtos.role_dto import RoleCreate, RoleUpdate, RoleRead


role_router = APIRouter(prefix="/roles", tags=["Roles"])

@role_router.post("", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
def create_role(role_data: RoleCreate, db: Session = Depends(get_db)):
    from app.repositories.role_repo import RoleRepository
    repo = RoleRepository(db)
    if repo.get_by_name(role_data.name):
        raise HTTPException(status_code=400, detail="Role already exists")
    return repo.create(role_data.model_dump())

@role_router.get("", response_model=List[RoleRead])
def get_all_roles(db: Session = Depends(get_db)):
    """id = 1 là user, 2 là admin"""
    from app.repositories.role_repo import RoleRepository
    return RoleRepository(db).get_all()

@role_router.put("/{role_id}", response_model=RoleRead)
def update_role(role_id: int, role_data: RoleUpdate, db: Session = Depends(get_db)):
    from app.repositories.role_repo import RoleRepository
    repo = RoleRepository(db)
    updated = repo.update(role_id, role_data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Role not found")
    return updated

@role_router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(role_id: int, db: Session = Depends(get_db)):
    from app.repositories.role_repo import RoleRepository
    repo = RoleRepository(db)
    deleted = repo.delete(role_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Role not found")
    return None