from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import logging
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, jobs, profiles, applications

logger = logging.getLogger(__name__)

# Auto-create tables for development convenience (especially when using SQLite)
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    logger.exception("Database initialization failed")
    if settings.ENVIRONMENT.lower() == "production":
        raise

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="HireAI — Intelligent Recruitment & Career Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
# Adjust origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["Jobs"])
app.include_router(profiles.router, prefix=f"{settings.API_V1_STR}/profiles", tags=["Profiles"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["Applications"])

@app.get("/health", tags=["Health"])
def health_check():
    from app.core.database import SessionLocal
    database_status = "connected"
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
    except Exception:
        database_status = "unavailable"
    return {
        "status": "healthy" if database_status == "connected" else "degraded",
        "service": settings.PROJECT_NAME,
        "database": database_status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
