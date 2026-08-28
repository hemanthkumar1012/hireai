from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import logging
from app.core.config import settings
from app.core.database import engine, Base
from app.models import *  # noqa: F401,F403 — ensures all models register with Base.metadata
from app.api import auth, jobs, profiles, applications, companies

logger = logging.getLogger(__name__)

# Auto-create tables (safe operation if they already exist)
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    logger.exception("Database initialization failed")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ApplyRight — Intelligent Recruitment & Career Platform API",
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
app.include_router(companies.router, prefix=f"{settings.API_V1_STR}/companies", tags=["Companies"])

@app.get("/", tags=["Health"])
def root():
    return {
        "service": "ApplyRight API",
        "status": "running",
        "health": "/health",
        "docs": "/docs"
    }

@app.head("/", tags=["Health"])
def root_head():
    return {}

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

@app.head("/health", tags=["Health"])
def health_head():
    return health_check()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
