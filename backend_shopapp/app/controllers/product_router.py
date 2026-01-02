from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.configs.dbConfig import get_db
from app.dtos.product_dto import ProductDTO
from app.services.product_service import ProductService

productRouter = APIRouter(prefix="/products", tags=["Products"])

def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)

@productRouter.get("/filter", response_model=List[ProductDTO])
def filter_products(
    keyword: Optional[str] = Query(None, description="Từ khóa tìm kiếm tên"),
    min_price: Optional[float] = Query(None, description="Giá thấp nhất"),
    max_price: Optional[float] = Query(None, description="Giá cao nhất"),
    category_id: Optional[int] = Query(None, description="ID danh mục"),
    sort_by: Optional[str] = Query(None, description="Sắp xếp: price_asc, price_desc, newest, best_selling"),
    skip: int = 0,
    limit: int = 20,
    service: ProductService = Depends(get_product_service)
):
    """
    API lọc sản phẩm đa năng:
    - Tìm theo tên, khoảng giá, danh mục
    - Sắp xếp (Mới nhất, Bán chạy, Giá tăng/giảm)
    """
    return service.get_filtered_products(
        keyword, min_price, max_price, category_id, sort_by, skip, limit
    )

@productRouter.get("/recommendations/{product_id}", response_model=List[ProductDTO])
def get_product_recommendations(
    product_id: int,
    limit: int = 6,
    service: ProductService = Depends(get_product_service)
):
    """
    Lấy danh sách sản phẩm gợi ý (cùng category) dựa trên product_id đang xem.
    """
    return service.get_recommendations(product_id, limit)

@productRouter.post("", response_model=ProductDTO, status_code=status.HTTP_201_CREATED)
def create_product(
    product_dto: ProductDTO,
    service: ProductService = Depends(get_product_service)
):
    try:
        return service.create_product(product_dto)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@productRouter.get("", response_model=List[ProductDTO])
def get_products_by_keyword(
    keyword: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    service: ProductService = Depends(get_product_service)
):
    """
    Lấy danh sách tất cả sản phẩm (có hỗ trợ tìm kiếm cơ bản).
    """
    return service.get_all_products(keyword, skip, limit)

@productRouter.get("/{product_id}", response_model=ProductDTO)
def get_product_by_id(
    product_id: int,
    service: ProductService = Depends(get_product_service)
):
    return service.get_product_by_id(product_id)

@productRouter.put("/{product_id}", response_model=ProductDTO)
def update_product(
    product_id: int,
    product_dto: ProductDTO,
    service: ProductService = Depends(get_product_service)
):
    return service.update_product(product_id, product_dto)

@productRouter.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    service: ProductService = Depends(get_product_service)
):
    return service.delete_product(product_id)
