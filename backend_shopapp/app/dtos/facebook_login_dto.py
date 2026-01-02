from pydantic import BaseModel, Field

class FacebookLoginDTO(BaseModel):
    facebook_token: str = Field(..., description="Access Token nhận được từ Facebook SDK")