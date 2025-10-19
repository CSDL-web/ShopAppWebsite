from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from configs.dbConfig import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)