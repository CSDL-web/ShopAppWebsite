from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from app.configs.dbConfig import Base

class FlywaySchemaHistory(Base):
    __tablename__ = "flyway_schema_history"

    installed_rank = Column(Integer, primary_key=True)
    version = Column(String(50))
    description = Column(String(200), nullable=False)
    type = Column(String(20), nullable=False)
    script = Column(String(1000), nullable=False)
    checksum = Column(Integer)
    installed_by = Column(String(100), nullable=False)
    installed_on = Column(TIMESTAMP, nullable=False) # Server default handled by DB
    execution_time = Column(Integer, nullable=False)
    success = Column(Boolean, nullable=False)