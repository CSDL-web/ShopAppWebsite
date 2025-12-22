from sqlalchemy.orm import Session
from typing import Optional
from app.models.comments_model import Comment
from datetime import datetime
def create_comment_repo(db: Session, comment: Comment) -> Comment:
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def find_comment_by_id(db: Session, comment_id: int) -> Optional[Comment]:
    return db.query(Comment).filter(Comment.id == comment_id).first()

def find_all_comments_repo(db: Session):
    return db.query(Comment).all()

def find_comments_by_product_id(db: Session, product_id: int):
    return db.query(Comment).filter(Comment.product_id == product_id).all()

def find_comments_by_user_id(db: Session, user_id: int):
    return db.query(Comment).filter(Comment.user_id == user_id).all()

def update_comment_repo(db: Session, comment: Comment, new_data: dict) -> Comment:
    for key, value in new_data.items():
        setattr(comment, key, value)

    db.commit()
    db.refresh(comment)
    return comment

def delete_comment_repo(db: Session, comment: Comment):
    db.delete(comment)
    db.commit()
    return True
