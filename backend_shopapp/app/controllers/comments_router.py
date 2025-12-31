from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dtos.comments_dto import CommentDTO
from app.services.comments_service import CommentsService
from app.configs.dbConfig import get_db

commentsRouter = APIRouter(prefix="/comments", tags=["Comments"])

def get_comments_service(db: Session = Depends(get_db)) -> CommentsService:
    return CommentsService(db)

@commentsRouter.post("", response_model=CommentDTO)
def create_comment(
    comment: CommentDTO,
    service: CommentsService = Depends(get_comments_service)
):
    return service.create_comment(comment)

@commentsRouter.get("/product/{product_id}", response_model=List[CommentDTO])
def get_comments_by_product(
    product_id: int,
    service: CommentsService = Depends(get_comments_service)
):
    return service.get_comments_by_product(product_id)

@commentsRouter.get("/user/{user_id}", response_model=List[CommentDTO])
def get_comments_by_user(
    user_id: int,
    service: CommentsService = Depends(get_comments_service)
):
    return service.get_comments_by_user(user_id)
