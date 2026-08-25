from typing import List, Optional
from pydantic import model_validator
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
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    
    # AI Config
    AI_PROVIDER: str = "mock"  # "mock" or "gemini"
    AI_API_KEY: Optional[str] = None
    ENVIRONMENT: str = "development"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode="after")
    def validate_production_security(self):
        if self.ENVIRONMENT.lower() == "production":
            if len(self.JWT_SECRET_KEY) < 32 or self.JWT_SECRET_KEY == "87f2e6b9a89d71c4c3b5d2e0f4a3e2d1c9b8a7f6e5d4c3b2a1":
                raise ValueError("JWT_SECRET_KEY must be a unique secret of at least 32 characters")
            if "*" in self.cors_origins:
                raise ValueError("Wildcard CORS is not allowed in production")
        return self

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
