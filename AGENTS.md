# AGENTS.md / CONVENTIONS.md

## 1. Project Goal
Build AlignMatrix, an enterprise-grade, asynchronous document evaluation SaaS. 
It maps job requirements to evidence in a candidate's resume, outputting a deterministic Evidence Matrix.

## 2. Tech Stack & Standards
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2.
- **Frontend**: Next.js 14+ (App Router), React, Tailwind, shadcn/ui.
- **Database**: PostgreSQL 15+ (JSONB for payloads).
- **AI Engine**: Google Gemini 3.8 Flash / Medium (`google-generativeai` SDK).
- **Deployment**: Vercel (Frontend), Render (Backend Web Service + Managed PostgreSQL via `render.yaml` Blueprint).

## 3. Core Architecture Rules
- **Strict Pydantic Enums**: The LLM must return strict JSON matching Pydantic schemas. 
- **Asynchronous Execution**: Polling model only. `QUEUED` -> `PROCESSING` -> `COMPLETED`. No SSE.
- **PII Scrubbing**: Presidio must scrub PII before sending text to Gemini.
- **Zero-Trust AI**: Validate the Gemini JSON output using `ScoreBreakdown.model_validate_json()`. If it fails, transition DB state to `FAILED` with `VALIDATION_FAILED` error code.
- **Postgres Dialect**: Use SQLAlchemy 2.0 with `psycopg` (v3) driver (`postgresql://` normalized in `backend.app.db.session`).
- **Render Production**: Configured via `render.yaml` with automatic binding of managed PostgreSQL `DATABASE_URL` and `uvicorn backend.app.main:app --port ${PORT:-8000}`.
- **Vercel Gateway**: Next.js rewrites proxy `/api/backend/:path*` directly to the Render backend via `BACKEND_API_URL` environment variable.
