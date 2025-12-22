from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.configs.dbConfig import get_db
from app.services.flyway_schema_history_service import FlywaySchemaHistoryService
from app.dtos.fly_schema_history_dto import FlywaySchemaHistoryRead
from app.models.user_model import User
from app.controllers.user_router import get_current_user

flyway_router = APIRouter(prefix="/admin/flyway", tags=["Admin Flyway"])

@flyway_router.get("", response_model=List[FlywaySchemaHistoryRead])
def get_migration_history(
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = FlywaySchemaHistoryService(db)
    return service.get_all_history(skip, limit, current_user)

@flyway_router.delete("/{rank}", status_code=204)
def delete_failed_migration(
    rank: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = FlywaySchemaHistoryService(db)
    try:
        service.delete_history_record(rank, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))