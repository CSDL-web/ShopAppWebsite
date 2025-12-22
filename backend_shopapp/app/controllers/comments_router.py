from fastapi import  Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.dtos.comments_dto import CommentDTO
from app.responses.commentsResponse import CommentResponse 
from app.services.comments_service import CommentsService
from app.configs.dbConfig import get_db

commentsRouter = APIRouter(prefix="/comments", tags=["Comments"])

@commentsRouter.post("/create_comment", response_model=CommentResponse)
def create_comment( comment: CommentDTO, db: Session = Depends(get_db)):
    return CommentsService.create_comment(db,comment)

@commentsRouter.get("/get_all_comments", response_model=List[CommentResponse])
def get_all_comments(db: Session = Depends(get_db)):
    return CommentsService.get_all_comments(db)
@commentsRouter.get("/get_comments_by_product/{product_id}", response_model=List[CommentResponse])
def get_comments_by_productID( product_id: int, db: Session = Depends(get_db)):
    return CommentsService.get_comments_by_product(db, product_id)
@commentsRouter.get("get_comments_by_user/{user_id}", response_model=List[CommentResponse])
def get_comments_by_userID(user_id: int, db:Session = Depends(get_db)):
    return CommentsService.get_comments_by_user(db, user_id)