from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from dtos.category_dto import CategoryCreate, CategoryRead, CategoryUpdate
from services.category_service import CategoryService
from configs.dbConfig import get_db

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@router.post(
    "/",
    response_model=CategoryRead, 
    status_code=status.HTTP_201_CREATED #trả về 201 success
)
def create_new_category(
    category_data: CategoryCreate,  
    service: CategoryService = Depends(get_category_service) 
):
    try:
        new_category = service.create_category(category_data)
        return new_category
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi máy chủ nội bộ: {str(e)}"
        )


@router.get(
    "/",
    response_model=List[CategoryRead] 
)
def get_all_categories(
    skip: int = 0,
    limit: int = 100,
    service: CategoryService = Depends(get_category_service)
):
    categories = service.get_all_categories(skip=skip, limit=limit)
    return categories


@router.get(
    "/{category_id}", 
    response_model=CategoryRead
)
def get_category_by_id(
    category_id: int,
    service: CategoryService = Depends(get_category_service)
):
    try:
        category = service.get_category_by_id(category_id)
        return category
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch(
    "/{category_id}",
    response_model=CategoryRead
)
def update_a_category(
    category_id: int,
    update_data: CategoryUpdate, 
    service: CategoryService = Depends(get_category_service)
):
    try:
        updated_category = service.update_category(category_id, update_data)
        return updated_category
    except ValueError as e:
        if "Không tìm thấy" in str(e):
            status_code = status.HTTP_404_NOT_FOUND
        else:
            status_code = status.HTTP_400_BAD_REQUEST
        
        raise HTTPException(status_code=status_code, detail=str(e))


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT 
)
def delete_a_category(
    category_id: int,
    service: CategoryService = Depends(get_category_service)
):
    try:
        service.delete_category(category_id)
        return None 
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )