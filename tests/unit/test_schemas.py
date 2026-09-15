import pytest
from pydantic import ValidationError
from backend.app.schemas.evaluation import (
    ResumeEvaluationRequest,
    MatchEvidence,
    MatchAssessment,
    ConfidenceLevel,
    GapEvidence,
    ImpactLevel,
)


def test_resume_evaluation_request_size_boundaries():
    # Valid sizes
    valid_jd = "A" * 150
    valid_resume = "B" * 100
    req = ResumeEvaluationRequest(job_description=valid_jd, resume_text=valid_resume)
    assert req.job_description == valid_jd

    # Too short job description (<100 chars)
    with pytest.raises(ValidationError):
        ResumeEvaluationRequest(job_description="Too short", resume_text=valid_resume)

    # Too short resume (<50 chars)
    with pytest.raises(ValidationError):
        ResumeEvaluationRequest(job_description=valid_jd, resume_text="Too short")

    # Oversized input (>30,000 JD chars)
    with pytest.raises(ValidationError):
        ResumeEvaluationRequest(job_description="A" * 30001, resume_text=valid_resume)


def test_strict_enums_in_evidence():
    # Valid enums
    evidence = MatchEvidence(
        requirement="Python proficiency",
        resume_excerpt="5 years of Python",
        assessment=MatchAssessment.MATCHED,
        confidence=ConfidenceLevel.HIGH,
        explanation="Direct match found.",
    )
    assert evidence.assessment == MatchAssessment.MATCHED

    # Invalid enum string
    with pytest.raises(ValidationError):
        MatchEvidence(
            requirement="Python proficiency",
            resume_excerpt="5 years of Python",
            assessment="SUPER_MATCHED",  # type: ignore
            confidence=ConfidenceLevel.HIGH,
            explanation="Invalid enum value.",
        )


def test_extra_fields_forbidden():
    # Reject arbitrary fields from hallucinating LLMs
    with pytest.raises(ValidationError):
        GapEvidence(
            missing_requirement="Kubernetes",
            impact=ImpactLevel.MEDIUM,
            explanation="No mention of k8s.",
            hallucinated_field="untrusted extra field",  # type: ignore
        )


def test_commercial_requirement_evaluation_strict_enums():
    from backend.app.schemas.evaluation import RequirementEvaluation, MatchStatus

    # Valid requirement evaluation
    item = RequirementEvaluation(
        requirement="Python (FastAPI / Asynchronous Architecture)",
        status=MatchStatus.DEMONSTRATED,
        evidence_found="Built asynchronous microservices in FastAPI",
        action="No action needed. Strong evidence cited.",
    )
    assert item.status == MatchStatus.DEMONSTRATED
    assert item.status == "Demonstrated"

    # Missing evidence with None is allowed
    missing_item = RequirementEvaluation(
        requirement="Kubernetes Orchestration",
        status=MatchStatus.MISSING,
        evidence_found=None,
        action="Add Docker/K8s experience or address in interview.",
    )
    assert missing_item.evidence_found is None
    assert missing_item.status == MatchStatus.MISSING

    # Invalid enum rejected
    with pytest.raises(ValidationError):
        RequirementEvaluation(
            requirement="Redis",
            status="Somewhat Demonstrated",  # type: ignore
            evidence_found=None,
            action="Clarify",
        )

    # Extra fields forbidden on RequirementEvaluation
    with pytest.raises(ValidationError):
        RequirementEvaluation(
            requirement="Redis",
            status=MatchStatus.PARTIAL,
            evidence_found="Used Redis cache",
            action="Clarify",
            untrusted_field="hallucination",  # type: ignore
        )


def test_commercial_score_breakdown_model_validate_json():
    import json
    from backend.app.schemas.evaluation import ScoreBreakdown

    valid_payload = json.dumps({
        "overall_score": 88,
        "metrics": {
            "strong": 10,
            "partial": 3,
            "missing": 2,
            "unsupported": 1
        },
        "evidence_matrix": [
            {
                "requirement": "Python / AsyncIO",
                "status": "Demonstrated",
                "evidence_found": "5 years designing asyncio backends",
                "action": "Highlight architectural metrics."
            },
            {
                "requirement": "PostgreSQL",
                "status": "Partial Match",
                "evidence_found": "Basic SQL query optimization",
                "action": "Add details on indexing and execution plans."
            },
            {
                "requirement": "Terraform",
                "status": "Missing",
                "evidence_found": None,
                "action": "Acknowledge IaC gap in interview."
            }
        ]
    })

    score = ScoreBreakdown.model_validate_json(valid_payload)
    assert score.overall_score == 88
    assert score.metrics["strong"] == 10
    assert len(score.evidence_matrix) == 3
    assert score.evidence_matrix[0].status == "Demonstrated"
    assert score.evidence_matrix[2].evidence_found is None


def test_zero_trust_ai_validation_failure():
    from backend.app.schemas.evaluation import ScoreBreakdown

    # Invalid JSON string
    with pytest.raises(ValidationError):
        ScoreBreakdown.model_validate_json("not a valid json")

    # Missing required overall_score
    invalid_payload = '{"metrics": {"strong": 5}, "evidence_matrix": []}'
    with pytest.raises(ValidationError):
        ScoreBreakdown.model_validate_json(invalid_payload)

    # Out of range overall_score (>100)
    out_of_bounds = '{"overall_score": 105, "metrics": {}, "evidence_matrix": []}'
    with pytest.raises(ValidationError):
        ScoreBreakdown.model_validate_json(out_of_bounds)

