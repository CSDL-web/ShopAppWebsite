from fastapi import APIRouter, HTTPException, status, Depends
from app.dtos.chat_dto import ChatRequest, ChatResponse
from app.services.chat_ai_service import ChatAIService

# Tạo router
chat_router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

# Dependency để khởi tạo Service (Singleton hoặc mỗi request 1 lần)
# Vì ChatAIService kết nối DB riêng qua LangChain nên ta khởi tạo trực tiếp
def get_chat_service():
    return ChatAIService()

@chat_router.post("", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    service: ChatAIService = Depends(get_chat_service)
):
    """
    API Chat với AI.
    - session_id: Nếu user đã login, truyền "user_{id}". Nếu chưa, truyền UUID random từ FE.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")

    answer = service.process_chat(request.question, request.session_id)
    
    return ChatResponse(response=answer)