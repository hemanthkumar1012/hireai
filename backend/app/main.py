from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import *  # noqa: F401,F403 — ensures all models register with Base.metadata
from app.api import auth, jobs, profiles, applications, companies

# Auto-create tables for development convenience (especially when using SQLite)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creating database tables: {e}")

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
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For simplified local workspace connectivity, allow all. Change to origins in prod.
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

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
