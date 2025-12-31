from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.configs.dbConfig import Base, engine

from app.controllers import (
    userRouter,
    categoryRouter,
    productRouter,
    commentsRouter,
    coupon_router,
    coupon_condition_router,
    order_router,
    order_detail_router,
    favorite_router,
    flyway_router,
    role_router
)

def init_routers(app: FastAPI):
    app.include_router(userRouter)
    app.include_router(role_router)

    app.include_router(categoryRouter)
    app.include_router(productRouter)
    app.include_router(commentsRouter)
    app.include_router(favorite_router)

    app.include_router(coupon_router)
    app.include_router(coupon_condition_router)
    app.include_router(order_router)
    app.include_router(order_detail_router)

    app.include_router(flyway_router)

def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend", version="1.0.0")

    Base.metadata.create_all(bind=engine)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_routers(app)
    return app

app = create_app()
