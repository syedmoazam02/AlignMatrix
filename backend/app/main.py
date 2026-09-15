import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.db.base import Base
from backend.app.db.session import engine
from backend.app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifecycle manager.
    Ensures database tables exist on startup and handles clean shutdown.
    """
    logger.info("Initializing database schemas...")
    Base.metadata.create_all(bind=engine)
    logger.info("AlignMatrix backend initialized and ready.")
    yield
    logger.info("AlignMatrix backend shutting down.")


app = FastAPI(
    title="AlignMatrix API",
    description=(
        "Production-grade, asynchronous document evaluation API. "
        "Delivers structured, evidence-backed candidate resume evaluations."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
)

# Dynamic Environment-based CORS Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "production").lower()

if ENVIRONMENT == "development":
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
else:
    allowed_origins = [
        "https://alignmatrix.vercel.app",
        "https://www.alignmatrix.ai",
        "https://alignmatrix.ai",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Zero-Trust Global Exception Handler.
    Prevents raw exceptions or internal implementation details from leaking to clients.
    """
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred while processing the request.",
        },
    )


# Mount API v1 router
app.include_router(api_router, prefix="/api/v1")
