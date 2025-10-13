from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from configs.dbConfig import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    phone_number = Column(String(10), nullable=False, unique=True)
    address = Column(String(200))
    password = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    date_of_birth = Column(Date)
    facebook_account_id = Column(Integer, default=0)
    google_account_id = Column(Integer, default=0)

    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")
