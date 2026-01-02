from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.configs.dbConfig import Base
from app.models.token_model import Token 
from app.models.social_account_model import SocialAccount

class User(Base):
    __tablename__ = "users"    
    id = Column(Integer, primary_key=True, index=True) 
    fullname = Column(String(100))
    phone_number = Column(String(15), nullable=True) 
    address = Column(String(200))
    password = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    date_of_birth = Column(Date)
    
   
    facebook_account_id = Column(String(100), default=None)
    google_account_id = Column(String(100), default=None)
    
    role_id = Column(Integer, ForeignKey("roles.id"))
    
   
    email = Column(String(255))
    profile_image = Column(String(255))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


    role = relationship("Role", back_populates="users")
    orders = relationship("Order", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    
    # Quan hệ với 2 file mới thêm
    tokens = relationship("Token", back_populates="user")
    social_accounts = relationship("SocialAccount", back_populates="user")