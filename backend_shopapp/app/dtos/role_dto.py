from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class RoleBase(BaseModel):
    name: str = Field(..., max_length=20) 

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=20)

class RoleRead(RoleBase):
    id: int
    #convert dict thành object
    model_config = ConfigDict(
        from_attributes=True  
    )
    