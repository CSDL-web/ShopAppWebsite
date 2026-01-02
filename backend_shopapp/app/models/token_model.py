from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255), unique=True, nullable=False)
    token_type = Column(String(50), nullable=False)
    expiration_date = Column(DateTime)
    revoked = Column(Boolean, nullable=False)
    expired = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    is_mobile = Column(Boolean, default=False)
    refresh_token = Column(String(255), default="")
    refresh_expiration_date = Column(DateTime)

    
    user = relationship("User", back_populates="tokens")