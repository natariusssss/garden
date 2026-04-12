from sqlalchemy import create_engine, inspect
from models import Base
from setconf import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

Base.metadata.create_all(bind=engine)

print("База данных создана!")
print("DATABASE_URL =", settings.DATABASE_URL)

inspector = inspect(engine)
for table in inspector.get_table_names():
    print(f" - {table}")