from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.mysql import JSON 
from sqlalchemy.sql import func
from app.configs.dbConfig import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # session_id sẽ lưu user_id (ví dụ "user_1") hoặc guest session
    session_id = Column(String(255), nullable=False, index=True)
    
    # LangChain lưu lịch sử dạng JSON (User: ..., AI: ...)
    message = Column(JSON, nullable=False)
    
    created_at = Column(DateTime, default=func.now())