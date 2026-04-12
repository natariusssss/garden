from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Settings:
    DATABASE_URL = f"sqlite:///{(BASE_DIR / 'garden.db').as_posix()}"
    SECRET_KEY = "your-secret-key-change-me-in-production"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()