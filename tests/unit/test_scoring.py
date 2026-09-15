import pytest
from backend.app.services.scoring import ScoringService
from backend.app.schemas.evaluation import (
    LLMScoreBreakdown,
    CategoryScore,
    MatchEvidence,
    MatchAssessment,
    ConfidenceLevel,
)


def create_sample_category(score: int) -> CategoryScore:
    return CategoryScore(
        score=score,
        rationale=f"Rationale for score {score}",
        evidence=[
            MatchEvidence(
                requirement="Sample requirement",
                resume_excerpt="Sample excerpt",
                assessment=MatchAssessment.MATCHED,
                confidence=ConfidenceLevel.HIGH,
                explanation="Sample match explanation",
            )
        ],
    )


def test_deterministic_scoring_calculation():
    """
    Test deterministic weighted calculation:
    skills(80)*0.30 (24) + experience(70)*0.25 (17.5) + alignment(60)*0.20 (12)
    + impact(90)*0.15 (13.5) + education(100)*0.10 (10)
    Total = 24 + 17.5 + 12 + 13.5 + 10 = 77.0 -> 77
    """
    breakdown = LLMScoreBreakdown(
        skills_match=create_sample_category(80),
        experience_match=create_sample_category(70),
        job_alignment=create_sample_category(60),
        impact_and_achievements=create_sample_category(90),
        education_match=create_sample_category(100),
        identified_gaps=[],
        strengths=["Strong skills"],
        recommendations=["Continue learning"],
    )

    overall_score = ScoringService.calculate_overall_score(breakdown)
    assert overall_score == 77

    enriched = ScoringService.enrich_with_overall_score(breakdown)
    assert enriched.overall_score == 77
    assert enriched.skills_match.score == 80


def test_scoring_boundary_clamping():
    """
    Ensure scoring handles extremes properly [0, 100].
    """
    zero_breakdown = LLMScoreBreakdown(
        skills_match=create_sample_category(0),
        experience_match=create_sample_category(0),
        job_alignment=create_sample_category(0),
        impact_and_achievements=create_sample_category(0),
        education_match=create_sample_category(0),
    )
    assert ScoringService.calculate_overall_score(zero_breakdown) == 0

    perfect_breakdown = LLMScoreBreakdown(
        skills_match=create_sample_category(100),
        experience_match=create_sample_category(100),
        job_alignment=create_sample_category(100),
        impact_and_achievements=create_sample_category(100),
        education_match=create_sample_category(100),
    )
    assert ScoringService.calculate_overall_score(perfect_breakdown) == 100
