from sqlalchemy.orm import Session
from sqlalchemy import func, desc, distinct
from datetime import date, timedelta
import calendar

from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_detail_model import OrderDetail
from app.models.product_model import Product

class StatisticService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_summary(self):
        today = date.today()
        
        total_users = self.db.query(func.count(User.id)).scalar()

        new_users_today = self.db.query(func.count(User.id)).filter(
            func.date(User.created_at) == today
        ).scalar()

        revenue_today = self.db.query(func.sum(Order.total_money)).filter(
            func.date(Order.order_date) == today,
            Order.status != 'cancelled' 
        ).scalar() or 0.0

        total_revenue = self.db.query(func.sum(Order.total_money)).filter(
            Order.status != 'cancelled'
        ).scalar() or 0.0

        return {
            "total_users": total_users,
            "new_users_today": new_users_today,
            "revenue_today": revenue_today,
            "total_revenue": total_revenue
        }

    def get_monthly_new_users(self, year: int = None):
        """Biểu đồ User theo tháng (CŨ)"""
        if not year:
            year = date.today().year

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

        data = {row.month: row.count for row in query}
        return [{"month": i, "new_users": data.get(i, 0)} for i in range(1, 13)]

    def get_daily_new_users(self, month: int, year: int):
        """Biểu đồ User theo ngày trong tháng (MỚI)"""
        if not year:
            year = date.today().year
        if not month:
            month = date.today().month

        _, num_days = calendar.monthrange(year, month)

        query = (
            self.db.query(
                func.day(User.created_at).label("day"),
                func.count(User.id).label("count")
            )
            .filter(
                func.year(User.created_at) == year,
                func.month(User.created_at) == month
            )
            .group_by(func.day(User.created_at))
            .all()
        )
        
        data = {row.day: row.count for row in query}
        return [{"day": i, "new_users": data.get(i, 0)} for i in range(1, num_days + 1)]

    def get_monthly_revenue(self, year: int = None):
        """Biểu đồ doanh thu (CŨ)"""
        if not year:
            year = date.today().year

        query = (
            self.db.query(
                func.month(Order.order_date).label("month"),
                func.sum(Order.total_money).label("total")
            )
            .filter(
                func.year(Order.order_date) == year,
                Order.status != 'cancelled'
            )
            .group_by(func.month(Order.order_date))
            .order_by(func.month(Order.order_date))
            .all()
        )

        data = {row.month: row.total for row in query}
        return [{"month": i, "revenue": data.get(i, 0)} for i in range(1, 13)]

    def get_operation_stats(self):
        pending_orders = self.db.query(func.count(Order.id)).filter(Order.status == 'pending').scalar() or 0
        
        shipping_orders = self.db.query(func.count(Order.id)).filter(Order.status == 'shipped').scalar() or 0
        
        total_orders = self.db.query(func.count(Order.id)).scalar() or 1
        cancelled_orders = self.db.query(func.count(Order.id)).filter(Order.status == 'cancelled').scalar() or 0
        cancel_rate = round((cancelled_orders / total_orders) * 100, 2)

        valid_query = self.db.query(
            func.sum(Order.total_money).label('total_money'),
            func.count(Order.id).label('total_count')
        ).filter(Order.status != 'cancelled').first()

        valid_revenue = valid_query.total_money or 0
        valid_orders_count = valid_query.total_count or 1
        
        aov = round(valid_revenue / valid_orders_count, 0)

        return {
            "pending_orders": pending_orders,
            "shipping_orders": shipping_orders,
            "cancel_rate": cancel_rate,
            "cancel_rate_alert": cancel_rate > 10,
            "aov": aov
        }

    def get_dead_stock_products(self, days: int = 30, limit: int = 10):
        """
        Lấy danh sách sản phẩm không bán được cái nào trong `days` ngày qua.
        """
        check_date = date.today() - timedelta(days=days)
        
        sold_product_ids = (
            self.db.query(distinct(OrderDetail.product_id))
            .join(Order, Order.id == OrderDetail.order_id)
            .filter(Order.order_date >= check_date)
            .filter(Order.status != 'cancelled')
        )

        dead_stock_products = (
            self.db.query(Product)
            .filter(Product.id.notin_(sold_product_ids))
            .limit(limit)
            .all()
        )

        return dead_stock_products

    def get_user_insights(self):
        total_users = self.db.query(func.count(User.id)).scalar() or 1
        
        buying_users = (
            self.db.query(func.count(distinct(Order.user_id)))
            .filter(Order.status != 'cancelled')
            .scalar()
        ) or 0
        
        conversion_rate = round((buying_users / total_users) * 100, 2)

        blocked_users = self.db.query(func.count(User.id)).filter(User.is_active == False).scalar() or 0

        return {
            "total_users": total_users,
            "buying_users": buying_users,
            "conversion_rate": conversion_rate,
            "blocked_users": blocked_users
        }

    def get_top_spending_users(self, limit: int = 20):
        """Top VIP (CŨ)"""
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
            .filter(Order.status == 'delivered')
            .group_by(User.id)
            .order_by(desc("total_spent"))
            .limit(limit)
            .all()
        )

        return [
            {
                "user_id": row.id,
                "fullname": row.fullname,
                "email": row.email or "",
                "phone": row.phone_number or "",
                "total_spent": row.total_spent,
                "order_count": row.order_count
            }
            for row in query
        ]
