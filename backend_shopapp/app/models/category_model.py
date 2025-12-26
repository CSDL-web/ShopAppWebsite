from sqlalchemy import Column, Integer, String
from app.configs.dbConfig import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    product = relationship("Product", back_populates="category")