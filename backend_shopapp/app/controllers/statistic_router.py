from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.configs.dbConfig import get_db
from app.services.statistic_service import StatisticService
from app.services.auth_service import get_current_user
from app.models.user_model import User

statisticRouter = APIRouter(prefix="/statistics", tags=["Admin Dashboard"])

def get_statistic_service(db: Session = Depends(get_db)) -> StatisticService:
    return StatisticService(db)

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.role or current_user.role.name != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin only"
        )
    return current_user

@statisticRouter.get("/summary")
def get_dashboard_summary(
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """
    Trả về:
    - Tổng user
    - User mới hôm nay
    - Doanh thu hôm nay
    - Tổng doanh thu
    """
    return service.get_dashboard_summary()

@statisticRouter.get("/chart-user-growth")
def get_user_growth_chart(
    year: Optional[int] = Query(None, description="Năm cần xem, mặc định năm nay"),
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    return service.get_monthly_new_users(year)

@statisticRouter.get("/chart-revenue")
def get_revenue_chart(
    year: Optional[int] = Query(None, description="Năm cần xem"),
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """Doanh thu"""
    return service.get_monthly_revenue(year)

@statisticRouter.get("/top-users")
def get_top_vip_users(
    limit: int = 20,
    service: StatisticService = Depends(get_statistic_service),
    admin: User = Depends(require_admin)
):
    """Lấy danh sách khách hàng chi tiêu nhiều nhất (chỉ tính đơn delivered)"""
    return service.get_top_spending_users(limit)
