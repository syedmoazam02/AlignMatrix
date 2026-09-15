import pytest
from fastapi.testclient import TestClient
from backend.app.core.security import get_current_user
from backend.app.main import app
from backend.app.models.user import User
from backend.app.workers.evaluator import process_evaluation_job


def test_health_check_endpoint(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


@pytest.mark.asyncio
async def test_full_evaluation_lifecycle_and_tenant_isolation(
    client: TestClient,
    user_a: User,
    user_b: User,
):
    # 1. User A submits evaluation
    job_description = (
        "Seeking a Senior Backend Engineer proficient in Python, FastAPI, and PostgreSQL. "
        "Must have experience designing distributed systems, caching with Redis, and writing automated test suites."
    )
    resume_text = (
        "Candidate Name: Alice Developer\n"
        "Email: alice@eng.io\n"
        "Phone: 555-123-4567\n"
        "Professional Experience: 6 years building high-throughput Python backend systems using FastAPI and SQLAlchemy. "
        "Implemented PostgreSQL query optimizations, Redis caching layers, and comprehensive pytest automation suites."
    )

    post_resp = client.post(
        "/api/v1/evaluations",
        json={"job_description": job_description, "resume_text": resume_text},
    )
    assert post_resp.status_code == 202
    created_data = post_resp.json()
    evaluation_id = created_data["evaluation_id"]
    assert created_data["status"] == "queued"

    # 2. Worker executes background job
    await process_evaluation_job(evaluation_id)

    # 3. User A polls status -> COMPLETED
    get_resp = client.get(f"/api/v1/evaluations/{evaluation_id}")
    assert get_resp.status_code == 200
    result = get_resp.json()

    assert result["id"] == evaluation_id
    assert result["status"] == "completed"
    assert result["score"] is not None
    assert result["score"]["overall_score"] >= 70
    assert result["score"]["skills_match"]["score"] > 0
    assert len(result["score"]["skills_match"]["evidence"]) > 0
    assert result["error"] is None

    # 4. Tenant Isolation Check: User B attempts to access User A's evaluation
    app.dependency_overrides[get_current_user] = lambda: user_b
    unauthorized_resp = client.get(f"/api/v1/evaluations/{evaluation_id}")
    assert unauthorized_resp.status_code == 404
    assert unauthorized_resp.json()["detail"] == "Evaluation not found."


@pytest.mark.asyncio
async def test_controlled_failure_state_handling(
    client: TestClient,
    monkeypatch: pytest.MonkeyPatch,
):
    # Mock LLM to raise an unexpected provider error
    class FailingLLM:
        async def evaluate(self, resume_text: str, job_description: str):
            raise RuntimeError("Provider connection timed out.")

    monkeypatch.setattr("backend.app.workers.evaluator.get_llm_service", lambda: FailingLLM())

    job_description = "A" * 150
    resume_text = "B" * 100

    post_resp = client.post(
        "/api/v1/evaluations",
        json={"job_description": job_description, "resume_text": resume_text},
    )
    evaluation_id = post_resp.json()["evaluation_id"]

    # Run worker with failing LLM
    await process_evaluation_job(evaluation_id)

    # Verify status is failed with safe error message and error code
    get_resp = client.get(f"/api/v1/evaluations/{evaluation_id}")
    assert get_resp.status_code == 200
    result = get_resp.json()

    assert result["status"] == "failed"
    assert result["score"] is None
    assert result["error"]["code"] == "INTERNAL_ERROR"
    assert "Provider connection timed out" not in result["error"]["message"]
