from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dtos.category_dto import CategoryCreate, CategoryRead, CategoryUpdate
from app.services.category_service import CategoryService
from app.configs.dbConfig import get_db
from app.services.auth_service import get_current_user
from app.models.user_model import User


categoryRouter = APIRouter(
    prefix="/categories",  
    tags=["Categories"]   
)


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@categoryRouter.post(
    "/create_new_category",
    response_model=CategoryRead, 
    status_code=status.HTTP_201_CREATED
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

@categoryRouter.get(
    "/get_all_categories",
    response_model=List[CategoryRead] 
)
def get_all_categories(
    skip: int = 0,
    limit: int = 100,
    service: CategoryService = Depends(get_category_service)
):
    categories = service.get_all_categories(skip=skip, limit=limit)
    return categories

@categoryRouter.get(
    "/get_category_by_id/{category_id}", 
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

@categoryRouter.patch(
    "/update_a_category/{category_id}",
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


@categoryRouter.delete(
    "/delete_a_category/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT 
)
def delete_a_category(
    category_id: int,
    service: CategoryService = Depends(get_category_service),
    current_user: User = Depends(get_current_user) 
):
    try:
        #check xem có quyền xóa hay không 
        service.delete_category(category_id, current_user)
        return None 
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except HTTPException as e:
        raise e