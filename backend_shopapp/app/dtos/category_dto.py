from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CategoryBase(BaseModel):
    name: str = Field(..., max_length=50)

class CategoryCreate(CategoryBase):
    id: int
    name: str
    pass

class CategoryUpdate(BaseModel): #by id
    id: int
    name: Optional[str] = Field(None, max_length=50)

class CategoryRead(CategoryBase): #data out rule
    id: int
    
    model_config = ConfigDict(
        from_attributes=True  
    )