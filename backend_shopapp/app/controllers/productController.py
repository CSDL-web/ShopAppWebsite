from fastapi import  Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.dtos.productDto import ProductDTO
from app.responses.productResponse import ProductResponse # chưa có
from app.services.productService import ProductService
from app.configs.dbConfig import get_db

productRouter = APIRouter(prefix="/products", tags=["Products"])

@productRouter.post("/create_product", response_model=ProductResponse)
def create_product(product_dto: ProductDTO, db: Session = Depends(get_db)):
    return ProductService.create_product(db, product_dto)


#2. Lấy toàn bộ sản phẩm
@productRouter.get("/get_all_products", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return ProductService.read_products(db)


#3. Cập nhật sản phẩm theo ID
@productRouter.put("/update_product/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_dto: ProductDTO, db: Session = Depends(get_db)):
    return ProductService.update_product(db, product_id, product_dto)


#4. Xóa sản phẩm theo ID
@productRouter.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return ProductService.delete_product(db, product_id)


#5. tạo sản phẩm mới 
#@productRouter.put("/create_product/{product_id}/{}")