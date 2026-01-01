from pydantic import BaseModel, Field

class GoogleLoginDTO(BaseModel):
    credential: str = Field(..., description="ID token (JWT) returned by GIS")  
