import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GlobeTrotter API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./globetrotter.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_globetrotter_key_123456")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 Hours
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")

    class Config:
        case_sensitive = True

settings = Settings()
