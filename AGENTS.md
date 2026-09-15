# AGENTS.md / CONVENTIONS.md

## 1. Project Goal
Build AlignMatrix, an enterprise-grade, asynchronous document evaluation SaaS. 
It maps job requirements to evidence in a candidate's resume, outputting a deterministic Evidence Matrix.

## 2. Tech Stack & Standards
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2.
- **Frontend**: Next.js 14+ (App Router), React, Tailwind, shadcn/ui.
- **Database**: PostgreSQL 15+ (JSONB for payloads).
- **AI Engine**: Google Gemini 3.8 Flash / Medium (`google-generativeai` SDK).
- **Deployment**: Vercel (Frontend), Render/Railway (Backend), Supabase/Neon (Postgres).

## 3. Core Architecture Rules
- **Strict Pydantic Enums**: The LLM must return strict JSON matching Pydantic schemas. 
- **Asynchronous Execution**: Polling model only. `QUEUED` -> `PROCESSING` -> `COMPLETED`. No SSE.
- **PII Scrubbing**: Presidio must scrub PII before sending text to Gemini.
- **Zero-Trust AI**: Validate the Gemini JSON output using `ScoreBreakdown.model_validate_json()`. If it fails, transition DB state to `FAILED` with `VALIDATION_FAILED` error code.
