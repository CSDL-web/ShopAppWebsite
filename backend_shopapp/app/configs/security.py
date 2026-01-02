import os
from dotenv import load_dotenv

load_dotenv()

# Key bí mật để mã hóa token (nên để chuỗi ngẫu nhiên dài)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))