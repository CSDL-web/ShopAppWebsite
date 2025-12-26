from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.configs.dbConfig import Base, engine

# Import tất cả Router từ package app.controllers
# (Đảm bảo file app/controllers/__init__.py đã export đầy đủ)
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
    # role_router # [Quan trọng] Bạn nhớ bỏ comment dòng này nếu đã tạo role_router.py
)

def init_routers(app: FastAPI):
    # Nhóm User & Auth
    app.include_router(userRouter)
    # app.include_router(role_router) # Đăng ký role router

    # Nhóm Sản phẩm & Danh mục
    app.include_router(categoryRouter)
    app.include_router(productRouter)
    app.include_router(commentsRouter)
    app.include_router(favorite_router)

    # Nhóm Đơn hàng & Khuyến mãi
    app.include_router(coupon_router)
    app.include_router(coupon_condition_router)
    app.include_router(order_router)
    app.include_router(order_detail_router)
    
    # Nhóm System/Admin
    app.include_router(flyway_router)

    
def create_app() -> FastAPI:
    app = FastAPI(title="ShopApp Backend", version="1.0.0")

    # Tự động tạo bảng nếu chưa có (lưu ý: trên Production nên dùng migration tool)
    Base.metadata.create_all(bind=engine)

    # --- CẤU HÌNH CORS (Thêm mới) ---
    # Cho phép mọi nguồn (origins=["*"]) để test cho dễ. 
    # Khi deploy thật thì sửa thành ["http://localhost:3000"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_routers(app)

    @app.get("/db")
    def check_db():
        return {"message": "Database connected successfully!"}
    
    return app