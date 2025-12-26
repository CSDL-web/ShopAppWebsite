# File: app/controllers/product_router.py
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.dtos.product_dto import ProductDTO
from app.services.product_service import ProductService
from app.configs.dbConfig import get_db

productRouter = APIRouter(prefix="/products", tags=["Products"])

@productRouter.post("", response_model=ProductDTO, status_code=status.HTTP_201_CREATED)
def create_product(product_dto: ProductDTO, db: Session = Depends(get_db)):
    try:
        # Service nên trả về Product model, Pydantic sẽ tự convert sang DTO
        return ProductService.create_product(db, product_dto)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@productRouter.get("", response_model=List[ProductDTO])
def get_all_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return ProductService.read_products(db)

@productRouter.get("/{product_id}", response_model=ProductDTO)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = ProductService.get_product_by_id(product_id) # Cần đảm bảo Service có hàm này (đã thêm ở bước trước)
    return product

@productRouter.put("/{product_id}", response_model=ProductDTO)
def update_product(product_id: int, product_dto: ProductDTO, db: Session = Depends(get_db)):
    return ProductService.update_product(db, product_id, product_dto)

@productRouter.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return ProductService.delete_product(db, product_id)