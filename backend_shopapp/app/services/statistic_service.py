from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract, case
from datetime import date, datetime, timedelta
from typing import List

from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_detail_model import OrderDetail

class StatisticService:
    def __init__(self, db: Session):
        self.db = db

    # ---------------------------------------------------------
    # 1. NHÓM CHỈ SỐ TỔNG QUAN (CARD STATS)
    # ---------------------------------------------------------
    def get_dashboard_summary(self):
        today = date.today()
        
        # 1. Tổng số user
        total_users = self.db.query(func.count(User.id)).scalar()

        # 2. User đăng ký mới HÔM NAY
        new_users_today = self.db.query(func.count(User.id)).filter(
            func.date(User.created_at) == today
        ).scalar()

        # 3. Doanh thu HÔM NAY (Chỉ tính đơn chưa huỷ)
        revenue_today = self.db.query(func.sum(Order.total_money)).filter(
            func.date(Order.order_date) == today,
            Order.status != 'cancelled' 
        ).scalar() or 0.0 # Nếu None thì trả về 0

        # 4. Tổng doanh thu toàn thời gian (Optional - để so sánh)
        total_revenue = self.db.query(func.sum(Order.total_money)).filter(
            Order.status != 'cancelled'
        ).scalar() or 0.0

        return {
            "total_users": total_users,
            "new_users_today": new_users_today,
            "revenue_today": revenue_today,
            "total_revenue": total_revenue
        }

    # ---------------------------------------------------------
    # 2. BIỂU ĐỒ TĂNG TRƯỞNG USER (THEO THÁNG)
    # ---------------------------------------------------------
    def get_monthly_new_users(self, year: int = None):
        """
        Đếm số user đăng ký theo từng tháng trong năm.
        Mặc định là năm hiện tại.
        """
        if not year:
            year = date.today().year

        # Query Group By Month
        # Lưu ý: func.month() hoạt động trên MySQL. 
        # Nếu dùng PostgreSQL thì dùng func.extract('month', User.created_at)
        query = (
            self.db.query(
                func.month(User.created_at).label("month"),
                func.count(User.id).label("count")
            )
            .filter(func.year(User.created_at) == year)
            .group_by(func.month(User.created_at))
            .order_by(func.month(User.created_at))
            .all()
        )

        # Map dữ liệu ra list 12 tháng (để frontend dễ vẽ biểu đồ, tháng nào ko có thì = 0)
        data = {row.month: row.count for row in query}
        result = [{"month": i, "new_users": data.get(i, 0)} for i in range(1, 13)]
        
        return result

    # ---------------------------------------------------------
    # 3. BIỂU ĐỒ DOANH THU (THEO THÁNG)
    # ---------------------------------------------------------
    def get_monthly_revenue(self, year: int = None):
        if not year:
            year = date.today().year

        query = (
            self.db.query(
                func.month(Order.order_date).label("month"),
                func.sum(Order.total_money).label("total")
            )
            .filter(
                func.year(Order.order_date) == year,
                Order.status != 'cancelled' # Không tính đơn huỷ
            )
            .group_by(func.month(Order.order_date))
            .order_by(func.month(Order.order_date))
            .all()
        )

        data = {row.month: row.total for row in query}
        result = [{"month": i, "revenue": data.get(i, 0)} for i in range(1, 13)]
        
        return result

    # ---------------------------------------------------------
    # 4. TOP 20 VIP USERS (CHI TIÊU NHIỀU NHẤT)
    # ---------------------------------------------------------
    def get_top_spending_users(self, limit: int = 20):
        """
        Lấy danh sách user chi nhiều tiền nhất (Dựa trên đơn hàng đã giao thành công - delivered)
        """
        query = (
            self.db.query(
                User.id,
                User.fullname,
                User.email,
                User.phone_number,
                func.sum(Order.total_money).label("total_spent"),
                func.count(Order.id).label("order_count")
            )
            .join(Order, User.id == Order.user_id)
            .filter(Order.status == 'delivered') # Chỉ tính đơn đã giao thành công
            .group_by(User.id)
            .order_by(desc("total_spent"))
            .limit(limit)
            .all()
        )

        return [
            {
                "user_id": row.id,
                "fullname": row.fullname,
                "email": row.email or "", # Handle None
                "phone": row.phone_number or "",
                "total_spent": row.total_spent,
                "order_count": row.order_count
            }
            for row in query
        ]