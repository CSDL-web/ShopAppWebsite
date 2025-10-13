from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.configs.dbConfig import get_db, Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    return {"message": "Database connected successfully!"}

