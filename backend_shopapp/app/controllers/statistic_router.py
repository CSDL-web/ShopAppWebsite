from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.configs.dbConfig import get_db
from app.services.statistic_service import StatisticService
from app.services.auth_service import get_current_user
from app.models.user_model import User
from app.dtos.product_dto import ProductDTO

statisticRouter = APIRouter(prefix="/statistics", tags=["Admin Dashboard"])

def get_statistic_service(db: Session = Depends(get_db)) -> StatisticService:
    """
    Dependency Injection cho StatisticService.
    """
    return StatisticService(db)

def require_admin(current_user: User = Depends(get_current_user)):
    """
    Dependency bắt buộc phải là Admin mới được truy cập.
    Nếu không phải admin -> Trả về lỗi 403 Forbidden.
    """
    if not current_user.role or current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin only"
        )
    return current_user

@statisticRouter.get("/general-statistics")
def get_general_statistics(
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Lấy các chỉ số tổng quan nhất cho Dashboard (Card Stats).
    
    Bao gồm:
    - total_users: Tổng số người dùng.
    - new_users_today: Số người đăng ký mới trong ngày.
    - revenue_today: Doanh thu trong ngày (đơn chưa hủy).
    - total_revenue: Tổng doanh thu toàn thời gian.
    """
    return service.get_dashboard_summary()

@statisticRouter.get("/chart-user-growth")
def get_user_growth_chart(
    year: Optional[int] = Query(None, description="Năm cần xem, mặc định năm nay"),
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Dữ liệu biểu đồ tăng trưởng người dùng theo từng THÁNG trong năm.
    
    Trả về: List 12 tháng kèm số lượng user mới tương ứng.
    """
    return service.get_monthly_new_users(year)

@statisticRouter.get("/chart-user-daily")
def get_user_daily_chart(
    month: int = Query(..., description="Tháng cần xem"),
    year: int = Query(..., description="Năm cần xem"),
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Dữ liệu biểu đồ tăng trưởng người dùng theo từng NGÀY trong một tháng cụ thể.
    
    Trả về: List các ngày trong tháng (1-30/31) kèm số lượng user mới.
    """
    return service.get_daily_new_users(month, year)

@statisticRouter.get("/chart-revenue")
def get_revenue_chart(
    year: Optional[int] = Query(None, description="Năm cần xem"),
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Dữ liệu biểu đồ doanh thu theo từng THÁNG trong năm.
    Chỉ tính các đơn hàng chưa bị hủy.
    """
    return service.get_monthly_revenue(year)

@statisticRouter.get("/operations")
def get_operations_metrics(
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Các chỉ số nóng phục vụ cho đội ngũ vận hành/trực page.
    
    Trả về:
    - pending_orders: Số đơn đang chờ duyệt.
    - shipping_orders: Số đơn đang giao.
    - cancel_rate: Tỷ lệ đơn bị Hủy/Hoàn trả (%).
    - cancel_rate_alert: Boolean.
    - aov: Giá trị trung bình của một đơn hàng.
    """
    return service.get_operation_stats()

@statisticRouter.get("/dead-stock", response_model=List[ProductDTO])
def get_dead_stock_products(
    days: int = 30,
    limit: int = 10,
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Lấy danh sách 'Hàng ế' (Dead Stock).
    
    Logic:
    - Tìm các sản phẩm không bán được đơn nào trong vòng `days` ngày qua.
    - Mặc định check trong 30 ngày gần nhất.
    - Trả về danh sách ProductDTO.
    """
    products = service.get_dead_stock_products(days, limit)
    return [ProductDTO.model_validate(p) for p in products]

@statisticRouter.get("/user-insights")
def get_user_insights_metrics(
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Các chỉ số chuyên sâu về hành vi người dùng.
    
    Trả về:
    - conversion_rate.
    - blocked_users.
    - total_users.
    - buying_users.
    """
    return service.get_user_insights()

@statisticRouter.get("/top-users")
def get_top_vip_users(
    limit: int = 20,
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Lấy danh sách khách hàng VIP (Top Spenders).
    
    Logic:
    - Chỉ tính các đơn hàng đã giao thành công.
    - Sắp xếp giảm dần theo tổng tiền chi tiêu.
    """
    return service.get_top_spending_users(limit)
