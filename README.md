# HireAI — Intelligent Recruitment & Career Platform

HireAI is a flagship production-grade recruitment and career intelligence platform. It features distinct portals for Job Seekers (AI resume analysis, automated job matching, career gap analysis, and tailored interview prep) and Recruiters (applicant tracking, AI candidate ranking, analytics dashboards, and job posting).

---

## 🔐 Phase 2 Authentication & Authorization Architecture

### 1. User Roles
- **`JOB_SEEKER`**: Applies for jobs, uploads CVs, tracks application pipelines, performs upskilling gap assessments, and generates interview guides. Maps to `/dashboard`.
- **`RECRUITER`**: Configures vacancies, shortlists applicants, audits suitability scores, and reviews conversion analytics. Maps to `/recruiter`.
- **`ADMIN`**: Platform administration and database audit triggers. Maps to `/admin`.

### 2. Authorization Middleware
FastAPI dependency injection guarantees secure endpoint protection:
- `get_current_user`: Verifies the validity of the JWT access token and ensures the account is active.
- `get_current_seeker`: Checks user role corresponds to `JOB_SEEKER`.
- `get_current_recruiter`: Checks user role corresponds to `RECRUITER`.
- `get_current_admin`: Checks user role corresponds to `ADMIN`.

### 3. JWT Token Rotation
- **Access Tokens**: Short-lived (30 minutes) credentials passed in the `Authorization: Bearer <token>` header. Expiration status is intercepted on the frontend using Axios.
- **Refresh Tokens**: Long-lived (7 days) tokens passed to `/auth/refresh` to automatically rotation-renew access and refresh tokens without user sign-in prompt loops.

---

## 🔌 API Endpoints Map

### 1. Authentication Router (`/api/v1/auth`)
- **`POST /register`**: Create new accounts with first/last names and role selector. Initializes profile assets for seekers.
- **`POST /login`**: Validate credentials and return JWT tokens.
- **`POST /refresh`**: Verify refresh tokens to generate new access/refresh pairs.
- **`POST /logout`**: Stateless logout cleanup indicator.
- **`GET /me`**: Retrieve active user details profile.
- **`POST /forgot-password`**: Dispatch password recovery simulations.

---

## ⚙️ Environment Variables

Create a `.env` file under `backend/` or configure them in your environment:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./hireai.db` |
| `JWT_SECRET_KEY` | JWT signature encryption key | `87f2e6b9a89d71c4c3b5d2e0f4a3e2d1c9b8...` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Access Token lifetime | `30` |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | Refresh Token lifetime | `7` |
| `REDIS_URL` | Redis broker URL (for Celery) | `redis://localhost:6379/0` |
| `AI_PROVIDER` | Swappable AI Engine (`mock` or `gemini`) | `mock` |
| `AI_API_KEY` | Google Generative AI API Key | *(Optional)* |

---

## 🚀 Local Development Setup

### 1. Run Migrations & Backend Service
Ensure Python is installed (accessible as `py` or `python`):
```bash
cd backend
py -m pip install -r requirements.txt
# Run local dev server (automatically initializes tables)
py -m uvicorn app.main:app --reload --port 8000
```
*Or execute: `start_backend.bat`*

Interactive Swagger docs will be hosted at: **`http://localhost:8000/docs`**

### 2. Frontend Web Portal
Ensure Node.js is installed:
```bash
cd frontend
npm install
npm run dev
```
*Or execute: `start_frontend.bat`*

The app will launch at: **`http://localhost:5173`**

---

## 🧪 Running Automated Tests
Execute unit and integration tests under `backend/`:
```bash
cd backend
py -m pytest
```
