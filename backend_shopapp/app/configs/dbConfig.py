import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if os.getenv("RUNNING_IN_DOCKER") is None:
    load_dotenv()

DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_ROOT_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD")
DB_NAME = os.getenv("MYSQL_DATABASE")
DB_PORT = os.getenv("MYSQL_PORT", "3306")

RUNNING_IN_DOCKER = os.getenv("RUNNING_IN_DOCKER", "false").lower() == "true"

if RUNNING_IN_DOCKER:
    DB_HOST = os.getenv("DB_HOST", "mysql_container")
else:
    DB_HOST = "localhost"

DB_USER_FINAL = DB_USER if DB_PASSWORD else "root"
DB_PASS_FINAL = DB_PASSWORD or DB_ROOT_PASSWORD

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER_FINAL}:{DB_PASS_FINAL}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

print(f"🔗 DATABASE_URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
