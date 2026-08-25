import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "HireAI"
    
    # Database
    DATABASE_URL: str = "sqlite:///./hireai.db"
    
    # Security
    JWT_SECRET_KEY: str = "87f2e6b9a89d71c4c3b5d2e0f4a3e2d1c9b8a7f6e5d4c3b2a1"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7     # 7 days
    
    # Redis (for Celery)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Config
    AI_PROVIDER: str = "mock"  # "mock" or "gemini"
    AI_API_KEY: Optional[str] = None

    @property
    def GEMINI_API_KEY(self) -> Optional[str]:
        return self.AI_API_KEY
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
