from app.controllers import userRouter,categoryRouter,productRouter,commentsRouter
from fastapi import FastAPI
from app.configs.dbConfig import Base, engine

from app.controllers.coupon_router import coupon_router
from app.controllers.coupon_condition_router import coupon_condition_router
from app.controllers.order_router import order_router
from app.controllers.order_detail_router import order_detail_router
from app.controllers.favorite_router import favorite_router

from app.controllers.flyway_schema_history_router import flyway_router


def init_routers(app: FastAPI):
    app.include_router(userRouter)
    app.include_router(categoryRouter)
    app.include_router(productRouter)
    app.include_router(commentsRouter)

    app.include_router(coupon_router)
    app.include_router(coupon_condition_router)
    app.include_router(order_router)
    app.include_router(order_detail_router)
    app.include_router(favorite_router)
    app.include_router(flyway_router)

    
def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend")

    Base.metadata.create_all(bind=engine)

    init_routers(app)

    @app.get("/db")
    def check_db():
        return {"message": "Database connected successfully!"}
    
    return app