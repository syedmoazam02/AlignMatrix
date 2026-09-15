from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.app.core.config import settings

# Configure connection arguments based on database dialect
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

# Standard session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """
    Request-scoped database session dependency for FastAPI route handlers.
    Yields session and guarantees cleanup upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_worker_db() -> Session:
    """
    Standalone session factory for background tasks and workers.
    Background jobs must call this to own their independent database session.
    """
    return SessionLocal()
