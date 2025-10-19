from sqlalchemy.orm import Session
from repositories.category_repo import CategoryRepository 
from dtos.category_dto import CategoryCreate, CategoryUpdate 
from models import Category 

class CategoryService:
    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    def create_category(self, category_data: CategoryCreate) -> Category:
        existing_category = self.repo.get_by_name(category_data.name)
        if existing_category:
            raise ValueError(f"Tên danh mục '{category_data.name}' đã tồn tại.")
        category_dict = category_data.model_dump() 
        return self.repo.create(category_dict)

    def get_category_by_id(self, category_id: int) -> Category:
        category = self.repo.get_by_id(category_id)
        if not category:
            raise ValueError(f"Không tìm thấy danh mục với ID {category_id}.")
        return category

    def get_all_categories(self, skip: int, limit: int):
        return self.repo.get_all(skip, limit)

    def update_category(self, category_id: int, update_data: CategoryUpdate) -> Category:
        db_category = self.get_category_by_id(category_id)
        if update_data.name and update_data.name != db_category.name:
            existing = self.repo.get_by_name(update_data.name)
            if existing:
                raise ValueError(f"Tên '{update_data.name}' đã được sử dụng.")
        update_dict = update_data.model_dump(exclude_unset=True)
        return self.repo.update(category_id, update_dict)

    def delete_category(self, category_id: int) -> Category:
        db_category = self.get_category_by_id(category_id) 
        return self.repo.delete(category_id)