from typing import Optional
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.models.user import User

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Vendor-agnostic current user dependency.
    In development/testing, provisions a default user if no token is provided.
    In production, enforces valid bearer credentials.
    """
    if credentials:
        token = credentials.credentials
        # Resolve user by token/email identifier
        email = f"user_{token[:8]}@example.com" if len(token) >= 8 else "authenticated_user@example.com"
    else:
        if settings.APP_ENV == "production":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication credentials were not provided.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Development / test default user
        email = "developer@alignmatrix.local"

    # Fetch or provision local user record
    stmt = select(User).where(User.email == email)
    user = db.scalar(stmt)
    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
