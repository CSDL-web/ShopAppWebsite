from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from app.models.comments_model import Comment
from app.dtos.comments_dto import CommentDTO
from app.repositories.comment_repo import CommentRepository # Import đúng tên file repo của bạn

class CommentsService:
    def __init__(self, db: Session):
        self.repo = CommentRepository(db)

    def create_comment(self, comment_dto: CommentDTO):
        # Chuyển DTO sang dict
        comment_data = {
            "product_id": comment_dto.product_id,
            "user_id": comment_dto.user_id,
            "content": comment_dto.content
        }
        # Gọi hàm create từ Repo
        return self.repo.create(comment_data)
    
    def get_comments_by_product(self, product_id: int):
        return self.repo.get_by_product_id(product_id)

    def get_comment_by_id(self, comment_id: int):
        comment = self.repo.get_by_id(comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")
        return comment

    def get_comments_by_user(self, user_id: int):
        return self.repo.get_by_user_id(user_id)

    def get_all_comments(self):
        return self.repo.get_all()

    def update_comment(self, comment_id: int, comment_dto: CommentDTO):
        # Check tồn tại
        existing_comment = self.repo.get_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")
        
        # Chỉ update nội dung (content)
        return self.repo.update(comment_id, comment_dto.content)

    def delete_comment(self, comment_id: int):
        existing_comment = self.repo.get_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Không tìm thấy bình luận")
            
        self.repo.delete(comment_id)
        return {"message": "Xóa bình luận thành công"}