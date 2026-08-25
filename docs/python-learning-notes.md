# Python Learning Notes

These notes describe the main Python concepts used in HireAI's backend.

## FastAPI routes

Files in `backend/app/api` define small functions that receive validated input and return data. `Depends` supplies shared services such as the database session and current authenticated user. Type hints help FastAPI build OpenAPI documentation and validate requests.

## SQLAlchemy models

Files in `backend/app/models` map Python classes to database tables. `Column` defines stored fields, foreign keys connect tables, and `relationship` lets related records be loaded through Python attributes. Constraints and indexes keep important data consistent and searchable.

## Schemas

Files in `backend/app/schemas` define the public request and response shapes with Pydantic. They are separate from database models so private fields such as password hashes are never returned by an API response.

## Authentication dependencies

`backend/app/api/deps.py` decodes the JWT, loads the user, checks account activity, and then applies role checks. A route that depends on `get_current_recruiter` cannot be used by a seeker even if the frontend is bypassed.

## AI service abstraction

`backend/app/ai/service.py` defines the methods that every provider must support. The mock provider makes local development and tests deterministic; the Gemini provider implements the same methods behind an environment-selected boundary.

## Migrations

Alembic migration functions contain explicit `upgrade` and `downgrade` operations. Production databases should be changed with `alembic upgrade head`, rather than relying on `Base.metadata.create_all`, which does not safely alter existing tables.