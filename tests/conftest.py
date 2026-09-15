import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

from backend.app.db.base import Base
from backend.app.db.session import get_db, get_worker_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.main import app

# In-memory SQLite engine with StaticPool so all sessions share the same memory instance
TEST_DB_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_database() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def user_a(db_session: Session) -> User:
    user = User(email="user_a@enterprise.test")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def user_b(db_session: Session) -> User:
    user = User(email="user_b@enterprise.test")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def client(user_a: User, monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    def override_get_current_user() -> User:
        return user_a

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    # Monkeypatch get_worker_db to use testing session
    monkeypatch.setattr("backend.app.workers.evaluator.get_worker_db", lambda: TestingSessionLocal())

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
