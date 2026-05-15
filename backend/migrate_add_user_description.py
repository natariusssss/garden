from sqlalchemy import create_engine, text
from setconf import settings


engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)


def column_exists(connection, table_name: str, column_name: str) -> bool:
    columns = connection.execute(text(f"PRAGMA table_info({table_name})")).fetchall()
    column_names = {column[1] for column in columns}
    return column_name in column_names


with engine.begin() as connection:
    if not column_exists(connection, "users", "description"):
        connection.execute(text("ALTER TABLE users ADD COLUMN description TEXT"))
        print("Колонка users.description добавлена")
    else:
        print("Колонка users.description уже существует")