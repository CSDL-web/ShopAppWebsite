from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class FlywaySchemaHistoryBase(BaseModel):
    version: Optional[str] = Field(None, max_length=50)
    description: str = Field(..., max_length=200)
    type: str = Field(..., max_length=20)
    script: str = Field(..., max_length=1000)
    checksum: Optional[int] = None
    installed_by: str = Field(..., max_length=100)
    execution_time: int = Field(..., description="Thời gian chạy (ms)")
    success: bool = Field(..., description="Trạng thái thành công")

class FlywaySchemaHistoryCreate(FlywaySchemaHistoryBase):
    installed_rank: int

class FlywaySchemaHistoryRead(FlywaySchemaHistoryBase):
    installed_rank: int
    installed_on: datetime

    model_config = ConfigDict(from_attributes=True)