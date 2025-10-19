from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from configs.dbConfig import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)