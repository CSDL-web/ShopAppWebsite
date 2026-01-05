from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.comments_model import Comment

class CommentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, comment_data: dict) -> Comment:
        db_comment = Comment(**comment_data)
        self.db.add(db_comment)
        self.db.commit()
        self.db.refresh(db_comment)
        return db_comment

    def get_by_id(self, comment_id: int) -> Optional[Comment]:
        return self.db.query(Comment).filter(Comment.id == comment_id).first()

    def get_by_product_id(self, product_id: int) -> List[Comment]:
        return self.db.query(Comment).filter(Comment.product_id == product_id).all()
    
    def get_by_user_id(self, user_id: int) -> List[Comment]:
        return self.db.query(Comment).filter(Comment.user_id == user_id).all()

    def get_all(self) -> List[Comment]:
        return self.db.query(Comment).all()

    def update(self, comment_id: int, content: str) -> Optional[Comment]:
        db_comment = self.get_by_id(comment_id)
        if db_comment:
            db_comment.content = content
            self.db.commit()
            self.db.refresh(db_comment)
        return db_comment

    def delete(self, comment_id: int) -> bool:
        db_comment = self.get_by_id(comment_id)
        if db_comment:
            self.db.delete(db_comment)
            self.db.commit()
            return True
        return False