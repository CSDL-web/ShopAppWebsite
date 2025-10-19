from app.models.user_model import User  
from app.models.role_model import Role  

def get_current_user() -> User: #hàm mock
    
    fake_admin_role = Role(
        id=0, 
        name='admin' 
    )
    
    fake_admin_user = User(
        id=999, 
        username='test_admin_user',
        role=fake_admin_role 
    )
    return fake_admin_user