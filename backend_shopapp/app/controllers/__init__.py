from fastapi import APIRouter
from .category_router import categoryRouter

userRouter = APIRouter(prefix="/api/users", tags=["Users"])
