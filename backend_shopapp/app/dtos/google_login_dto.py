from pydantic import BaseModel, Field

class GoogleLoginDTO(BaseModel):
    google_token: str = Field(..., description="Token ID (credential) nhận được từ Google SDK")