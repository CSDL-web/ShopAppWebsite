from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.token_model import Token

class TokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, token_data: dict) -> Token:
        db_token = Token(**token_data)
        self.db.add(db_token)
        self.db.commit()
        self.db.refresh(db_token)
        return db_token

    def get_by_token(self, token: str) -> Optional[Token]:
        return self.db.query(Token).filter(Token.token == token).first()
    
    def get_by_refresh_token(self, refresh_token: str) -> Optional[Token]:
        return self.db.query(Token).filter(Token.refresh_token == refresh_token).first()

    def get_all_valid_tokens_by_user(self, user_id: int) -> List[Token]:
        # Lấy các token chưa hết hạn và chưa bị thu hồi của user
        return self.db.query(Token).filter(
            Token.user_id == user_id, 
            Token.revoked == False, 
            Token.expired == False
        ).all()

    def save(self, token: Token) -> Token:
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token