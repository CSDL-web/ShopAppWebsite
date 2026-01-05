from fastapi import APIRouter

from .category_router import categoryRouter
from .user_router import userRouter
from .product_router import productRouter       
from .comments_router import commentsRouter
from .order_router import order_router
from .order_detail_router import order_detail_router
from .coupon_router import coupon_router
from .coupon_condition_router import coupon_condition_router
from .favorite_router import favorite_router
from .role_router import role_router            
from .flyway_schema_history_router import flyway_router 
from .product_image_router import product_image_router
from .statistic_router import statisticRouter
