from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.configs.dbConfig import Base, engine
from app.controllers import userRouter, categoryRouter


def init_routers(app: FastAPI):
    app.include_router(userRouter)
    app.include_router(categoryRouter)


def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend")

    # 🔥 CORS MIDDLEWARE – PHẢI đặt NGAY SAU FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",  # Vite
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)
    init_routers(app)

    @app.get("/db")
    def check_db():
        return {"message": "Database connected successfully!"}

    return app
