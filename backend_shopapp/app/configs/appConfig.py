from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.routers.health_router import router as health_router


from app.configs.dbConfig import Base, engine
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
    product_image_router
)

# -------------------------
# Seed default roles
# -------------------------
def seed_roles():
    with Session(engine) as session:
        if not session.get(Role, 1):
            session.add(Role(id=1, name="USER"))
        if not session.get(Role, 2):
            session.add(Role(id=2, name="ADMIN"))
        session.commit()

# -------------------------
# Register routers
# -------------------------
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
    app.include_router(product_image_router)
    app.include_router(health_router)

# -------------------------
# Create app
# -------------------------
def create_app() -> FastAPI:
    app = FastAPI(
        title="ShopApp Backend",
        version="1.0.0"
    )

    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed data
    seed_roles()

    # -------------------------
    # Health check
    # -------------------------
    @app.get("/health")
    def health():
        return {"status": "ok"}

    # -------------------------
    # Readiness check (DB)
    # -------------------------
    @app.get("/ready")
    def ready():
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ready"}

    # -------------------------
    # CORS
    # -------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    init_routers(app)

    return app
