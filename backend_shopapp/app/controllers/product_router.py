from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.dtos.product_dto import ProductDTO
from app.services.product_service import ProductService
from app.configs.dbConfig import get_db

productRouter = APIRouter(prefix="/products", tags=["Products"])

def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)

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
def get_all_products(
    keyword: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    service: ProductService = Depends(get_product_service)
):
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
