import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from sqlalchemy import create_engine
from models import Base

DATABASE_URL = "sqlite:///./garden.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

Base.metadata.create_all(bind=engine)

print("База данных создана!")
from sqlalchemy import inspect
inspector = inspect(engine)
for table in inspector.get_table_names():
    print(f"  - {table}")