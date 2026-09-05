from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.core.config import settings
from app.core.database import engine
from app.api import auth, jobs, profiles, applications, companies


def ensure_runtime_schema() -> None:
    try:
        inspector = inspect(engine)

        if not inspector.has_table("job_seeker_profiles"):
            return

        columns = {
            column["name"]
            for column in inspector.get_columns("job_seeker_profiles")
        }

        if "resume_analysis" not in columns:
            with engine.begin() as connection:
                connection.execute(
                    text(
                        "ALTER TABLE job_seeker_profiles "
                        "ADD COLUMN resume_analysis JSON"
                    )
                )
    except Exception:
        pass


ensure_runtime_schema()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ApplyRight — Intelligent Recruitment & Career Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"],
)

app.include_router(
    jobs.router,
    prefix=f"{settings.API_V1_STR}/jobs",
    tags=["Jobs"],
)

app.include_router(
    profiles.router,
    prefix=f"{settings.API_V1_STR}/profiles",
    tags=["Profiles"],
)

app.include_router(
    applications.router,
    prefix=f"{settings.API_V1_STR}/applications",
    tags=["Applications"],
)

app.include_router(
    companies.router,
    prefix=f"{settings.API_V1_STR}/companies",
    tags=["Companies"],
)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "ApplyRight API",
        "status": "running",
        "health": "/health",
        "docs": "/docs",
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
        "database": database_status,
    }


@app.head("/health", tags=["Health"])
def health_head():
    return health_check()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
