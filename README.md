# HireAI

HireAI is an intelligent recruitment workspace connecting job seekers and recruiters through structured profiles, job discovery, applications, and explainable AI-assisted matching.

> Current release scope: authentication, role-based portals, seeker profiles and resume text parsing, job lifecycle management, saved jobs, applications, career-gap analysis, recruiter candidate views, analytics UI, Celery task scaffolding, and mock/Gemini AI providers. Interview scheduling, notifications, company management, PDF upload/ATS analysis, recommendations, and admin management APIs remain planned work.

## Features

- JWT authentication with access and refresh tokens
- `JOB_SEEKER`, `RECRUITER`, and `ADMIN` role authorization
- Seeker profile, skills, education, experience, resume text parsing, and career gaps
- Job search with keyword, location, skill, pagination, and lifecycle filtering
- Saved jobs and duplicate-safe applications
- Recruiter job creation, editing, publishing, closing, archiving, and applicant review
- AI service abstraction with deterministic mock mode and optional Google Gemini integration
- Celery and Redis configuration for expensive background work
- OpenAPI documentation at `/docs`

## Technology Stack

- Backend: Python 3.12, FastAPI, Pydantic, SQLAlchemy, Alembic
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Recharts
- Data: PostgreSQL in deployment, SQLite for local tests
- Authentication: JWT and bcrypt
- Background work: Celery with Redis
- AI: `google-genai` provider plus local mock provider
- Delivery: Docker Compose and GitHub Actions

## Architecture

The backend is organized by responsibility:

- `backend/app/api`: HTTP routes and authorization dependencies
- `backend/app/schemas`: request and response validation
- `backend/app/models`: SQLAlchemy persistence models
- `backend/app/core`: configuration, database, and security
- `backend/app/ai`: provider interface, mock provider, and Gemini adapter
- `backend/app/workers`: Celery application and background tasks

The frontend uses React Router, shared layout/components, and an Axios API client. The API is versioned under `/api/v1`.

## Local Setup

Requirements: Python 3.12+, Node.js 20+, and npm.

```bash
git clone https://github.com/hemanthkumar1012/hireai.git
cd hireai
python -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
cd backend
python -m alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Frontend: `http://localhost:5173`

API and Swagger: `http://localhost:8000/docs`

Health: `http://localhost:8000/health`

## Environment Variables

Copy `backend/.env.example` to `backend/.env`. Never commit the resulting file.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL or SQLite SQLAlchemy URL |
| `JWT_SECRET_KEY` | Unique secret, at least 32 characters in production |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Access-token lifetime |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | Refresh-token lifetime |
| `REDIS_URL` | Celery broker and result backend |
| `AI_PROVIDER` | `mock` or `gemini` |
| `AI_API_KEY` | Optional Google Gemini credential; provide only through environment/secrets |
| `CORS_ORIGINS` | Comma-separated approved frontend origins |
| `ENVIRONMENT` | `development` or `production` |

## Testing

```bash
cd backend
python -m pytest -q
python -m alembic upgrade head
python -m alembic downgrade base

cd ../frontend
npm ci
npm run build
npm audit --audit-level=high --omit=dev
```

## Docker

Docker Compose runs PostgreSQL, Redis, the FastAPI backend, Celery worker, and the Vite development frontend:

```bash
export JWT_SECRET_KEY="use-a-unique-local-secret-at-least-32-characters"
docker compose -f infrastructure/docker-compose.yml config
docker compose -f infrastructure/docker-compose.yml up --build
```

The Docker daemon and Docker Compose must be installed locally. Production deployments should use managed PostgreSQL/Redis, private networking, TLS termination, secret storage, backups, and resource limits.

## CI/CD

GitHub Actions runs on pushes and pull requests targeting `main`. It installs locked frontend dependencies with `npm ci`, runs backend tests and migration checks, performs TypeScript compilation, builds the production frontend, and runs dependency audit checks. CI does not deploy infrastructure or require production credentials.

## API Documentation

Start the backend and open `/docs` for the generated OpenAPI contract. Main route groups are:

- `/api/v1/auth`: registration, login, refresh, logout, password recovery, current user
- `/api/v1/profiles`: seeker profile, resume text parsing, career-gap analysis
- `/api/v1/jobs`: search, details, recruiter management, lifecycle, saved jobs
- `/api/v1/applications`: apply, seeker/recruiter lists, details, recruiter status updates
- `/health`: database-backed service health

## Security Notes

Admin accounts must be provisioned administratively. Production startup rejects the development JWT secret and wildcard CORS. Resume file upload is not currently implemented; future upload work must validate MIME type, size, content, storage location, and malware scanning before persistence.

## Future Improvements

Interview scheduling, notifications, company and admin APIs, PDF resume intelligence, persistent AI analysis records, recommendations, distributed rate limiting, structured logging, and browser end-to-end tests are the next release areas.
