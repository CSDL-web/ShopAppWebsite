from pydantic import BaseModel, Field

class UserLoginDTO(BaseModel):
    phone_number: str = Field(..., description="Phone number is required")
    password: str = Field(..., description="Password cannot be blank")
