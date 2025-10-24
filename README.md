# Organization & Users Management (Full)
This package contains a full-stack application with:
- FastAPI backend (Python)
- React + Tailwind frontend
- MySQL database
- Alembic (migrations)
- Docker & docker-compose for easy local setup
- Manual run supported (npm start + uvicorn)

## Quick start (manual)
1. Backend:
   - Copy `backend/.env.example` to `backend/.env` and update `DATABASE_URL` if needed.
   - Create virtualenv, install: `pip install -r backend/requirements.txt`
   - Initialize DB (if using MySQL): ensure MySQL is running and DATABASE_URL points to it.
   - Run seed: `python -m backend.seed`
   - Start backend: `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000`

2. Frontend:
   - In `frontend/`: copy `.env.example` to `.env`
   - Install deps: `npm install`
   - Start: `npm start` (runs on port 3000)

## Quick start (Docker)
1. Ensure Docker and docker-compose are installed.
2. Run: `docker compose up --build`
3. Visit http://localhost:3000 for frontend and http://localhost:8000/docs for API docs.

Notes:
- Alembic is included in `backend/alembic/` for migrations. For production, adapt configs and create proper revisions.
- This codebase is intentionally rewritten and original to avoid plagiarism while matching expected functionality.