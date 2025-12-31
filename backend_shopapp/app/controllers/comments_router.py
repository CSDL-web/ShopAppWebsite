
from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dtos.comments_dto import CommentDTO
from app.services.comments_service import CommentsService
from app.configs.dbConfig import get_db

commentsRouter = APIRouter(prefix="/comments", tags=["Comments"])

@commentsRouter.post("", response_model=CommentDTO)
def create_comment(comment: CommentDTO, db: Session = Depends(get_db)):
    return CommentsService.create_comment(db, comment)

@commentsRouter.get("/product/{product_id}", response_model=List[CommentDTO])
def get_comments_by_product(product_id: int, db: Session = Depends(get_db)):
    return CommentsService.get_comments_by_product(db, product_id)

@commentsRouter.get("/user/{user_id}", response_model=List[CommentDTO])
def get_comments_by_user(user_id: int, db: Session = Depends(get_db)):
    return CommentsService.get_comments_by_user(db, user_id)