from  sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
from app.models.comments_model import Comment
from app.dtos.comments_dto import CommentDTO
from app.repositories.commentsRepo import (
    create_comment_repo,
    find_comment_by_id,
    find_comments_by_product_id,
    find_comments_by_user_id,
    find_all_comments_repo,
    update_comment_repo,
    delete_comment_repo)

class CommentsService:
    @staticmethod
    def create_comment(db: Session, comment_dto: CommentDTO):
        new_comment = Comment(
            product_id = comment_dto.product_id,
            user_id = comment_dto.user_id,
            content = comment_dto.content
        )
        return create_comment_repo(db, new_comment)
    
    @staticmethod
    def get_comments_by_product(db: Session, product_id: int):
        return find_comments_by_product_id(db, product_id)
    @staticmethod
    def get_comment_by_id(db: Session, id: int):
        return find_comment_by_id(db, id)
    @staticmethod
    def get_comments_by_user(db: Session, user_id: int):
        return find_comments_by_user_id(db, user_id)
    @staticmethod
    def get_all_comments(db: Session) -> List[Comment]:
        return find_all_comments_repo(db)

    @staticmethod
    def update_comment(db: Session, comment_id: int, comment_dto: CommentDTO):
        comment = find_comment_by_id(db, comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        new_data = comment_dto.dict(exclude_unset=True)
        return update_comment_repo(db, comment, new_data)
    def delete_comment(db: Session, comment_id: int):
        comment = find_comment_by_id(comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")
        delete_comment_repo(db, comment)