from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.product_model import Product
from app.models.user_model import User
from app.dtos.productDto import ProductDTO, ProductImageDTO
from app.repositories.productRepo import (
    create_product_repo,
    find_product_by_name,
    find_product_by_id,
    get_all_products_repo,
    update_product_repo,
    delete_product_repo,
)

class ProductService:

    @staticmethod
    def create_product(db: Session, product_dto: ProductDTO):
        # ✅ 1. Kiểm tra trùng tên
        if find_product_by_name(db, product_dto.name):
            raise HTTPException(status_code=400, detail="Tên sản phẩm đã tồn tại")

        # ✅ 2. Kiểm tra dữ liệu hợp lệ
        if product_dto.price < 0:
            raise HTTPException(status_code=400, detail="Giá sản phẩm không hợp lệ")

        if product_dto.stock_quantity < 0:
            raise HTTPException(status_code=400, detail="Số lượng không hợp lệ")

        # ✅ 3. Gọi repository để tạo
        new_product = create_product_repo(db, product_dto)
        return new_product


    @staticmethod
    def read_products(db: Session):
        products = get_all_products_repo(db)
        return products


    @staticmethod
    def update_product(db: Session, product_id: int, product_dto: ProductDTO) -> Product:
        existing_product = find_product_by_id(db, product_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

        # Chuyển DTO sang dict
        data = product_dto.dict(exclude_unset=True)
        updated_product = update_product_repo(db, existing_product, data)
        return updated_product


    @staticmethod
    def delete_product(db: Session, product_id: int):
        deleted = delete_product_repo(db, product_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm để xóa")
        return {"message": "Xóa sản phẩm thành công"}