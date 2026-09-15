from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.db.session import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=Dict[str, str])
def health_check(db: Session = Depends(get_db)) -> Dict[str, str]:
    """
    Service and database health probe.
    Does not execute external LLM calls.
    """
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "ok",
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unreachable: {exc}",
        )
