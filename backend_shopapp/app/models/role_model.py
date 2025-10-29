from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    users = relationship("User", back_populates="role")
