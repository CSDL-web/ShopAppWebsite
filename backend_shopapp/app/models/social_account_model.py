from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(String(20), nullable=False) # Tên nhà cung cấp (Google, Facebook)
    provider_id = Column(String(50), nullable=False)
    email = Column(String(150), nullable=False)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))


    user = relationship("User", back_populates="social_accounts")