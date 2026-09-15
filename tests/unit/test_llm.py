import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from backend.app.services.llm import MockEvaluator, GeminiEvaluator, get_llm_service
from backend.app.schemas.evaluation import ScoreBreakdown, MatchStatus


@pytest.mark.asyncio
async def test_mock_evaluator_returns_valid_score_breakdown():
    evaluator = MockEvaluator()
    assert evaluator.model_identifier == "mock/mock-v2-commercial"

    resume_sample = """
    Jane Doe
    Senior Backend Engineer with 6 years of experience building Python and FastAPI architectures.
    Deep expertise in PostgreSQL query optimization and indexing strategies.
    Implemented Redis caching layers with semantic invalidation.
    """
    jd_sample = "Looking for Senior Backend Engineer with Python, FastAPI, and PostgreSQL mastery."

    score = await evaluator.evaluate(resume_sample, jd_sample)

    assert isinstance(score, ScoreBreakdown)
    assert 0 <= score.overall_score <= 100
    assert "strong" in score.metrics
    assert "partial" in score.metrics
    assert "missing" in score.metrics
    assert "unsupported" in score.metrics
    assert len(score.evidence_matrix) > 0
    assert score.evidence_matrix[0].status in [
        MatchStatus.DEMONSTRATED,
        MatchStatus.PARTIAL,
        MatchStatus.MISSING,
        MatchStatus.UNSUPPORTED,
    ]


@pytest.mark.asyncio
async def test_gemini_evaluator_structured_output():
    # Mock the Gemini generative model async call
    evaluator = GeminiEvaluator(api_key="mock-test-key", model_name="gemini-test")
    assert evaluator.model_identifier == "google/gemini-test"

    valid_gemini_response = json.dumps({
        "overall_score": 91,
        "metrics": {
            "strong": 8,
            "partial": 2,
            "missing": 1,
            "unsupported": 0
        },
        "evidence_matrix": [
            {
                "requirement": "Python / AsyncIO",
                "status": "Demonstrated",
                "evidence_found": "6 years building Python and FastAPI architectures",
                "action": "Solid evidence."
            },
            {
                "requirement": "PostgreSQL",
                "status": "Demonstrated",
                "evidence_found": "Deep expertise in PostgreSQL query optimization",
                "action": "Solid evidence."
            }
        ]
    })

    mock_response = MagicMock()
    mock_response.text = valid_gemini_response

    with patch.object(evaluator.model, "generate_content_async", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = mock_response
        result = await evaluator.evaluate("Resume text", "Job description")

        assert result.overall_score == 91
        assert len(result.evidence_matrix) == 2
        assert result.evidence_matrix[0].requirement == "Python / AsyncIO"


def test_get_llm_service_fallback_to_mock(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    service = get_llm_service()
    assert isinstance(service, MockEvaluator)
