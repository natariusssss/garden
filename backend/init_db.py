from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import Base
from setconf import settings
from seed_plants import seed_plants
from seed_achievements import seed_achievements

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_plants(db)
finally:
    db.close()
seed_achievements()

print("База данных создана!")
print("DATABASE_URL =", settings.DATABASE_URL)

inspector = inspect(engine)
for table in inspector.get_table_names():
    print(f"- {table}")