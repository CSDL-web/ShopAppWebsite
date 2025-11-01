from app.controllers import userRouter
from fastapi import FastAPI
from app.configs.dbConfig import Base, engine


def init_routers(app: FastAPI):
    app.include_router(userRouter)
    
def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend")

    Base.metadata.create_all(bind=engine)

    init_routers(app)

    @app.get("/db")
    def check_db():
        return {"message": "Database connected successfully!"}
    
    return app
