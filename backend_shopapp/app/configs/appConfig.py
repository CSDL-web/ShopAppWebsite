from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles

from app.configs.dbConfig import Base, engine
from app.controllers import userRouter, categoryRouter
from app.models.role_model import Role

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
    role_router,
    product_image_router,
    statisticRouter,
)

def seed_roles():
    with Session(engine) as session:
        if not session.get(Role, 1):
            role_user = Role(id=1, name="USER")
            session.add(role_user)

        if not session.get(Role, 2):
            role_admin = Role(id=2, name="ADMIN")
            session.add(role_admin)

        session.commit()

def init_routers(app: FastAPI):
    app.include_router(userRouter)
    app.include_router(categoryRouter)
    app.include_router(productRouter)
    app.include_router(statisticRouter)
    app.include_router(role_router)
    app.include_router(commentsRouter)
    app.include_router(favorite_router)
    app.include_router(coupon_router)
    app.include_router(coupon_condition_router)
    app.include_router(order_router)
    app.include_router(order_detail_router)
    app.include_router(flyway_router)
    app.include_router(product_image_router)
    

def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend", version="1.0.0")
    seed_roles()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.mount(
        "/backend_shopapp/uploads",
        StaticFiles(directory="/app/app/uploads"),
        name="uploads"
    )


    init_routers(app)
    return app

app = create_app()
