from fastapi import APIRouter
from .category_router import router as categoryRouter

userRouter = APIRouter(prefix="/api/users", tags=["Users"])
