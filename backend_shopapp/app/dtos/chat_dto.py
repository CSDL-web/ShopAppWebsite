from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    question: str = Field(..., description="Câu hỏi của người dùng")
    session_id: str = Field(..., description="ID phiên chat (hoặc ID User)")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Câu trả lời từ AI")