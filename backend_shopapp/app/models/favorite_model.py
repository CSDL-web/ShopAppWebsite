from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.dbConfig import Base

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    product_id = Column(Integer, ForeignKey("products.id"))

    # Relationships
    user = relationship("User", back_populates="favorites")

    product = relationship("Product", back_populates="favorites")