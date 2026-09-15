from backend.app.core.config import settings
from backend.app.schemas.evaluation import (
    LLMScoreBreakdown,
    ScoreBreakdown,
    RequirementEvaluation,
    MatchStatus,
    MatchAssessment,
)


class ScoringService:
    @staticmethod
    def calculate_overall_score(breakdown: LLMScoreBreakdown) -> int:
        """
        Deterministically calculate the weighted overall score from LLM category scores.
        Weights are controlled strictly in configuration/domain logic, not prompts.
        """
        weighted_sum = (
            breakdown.skills_match.score * settings.WEIGHT_SKILLS_MATCH
            + breakdown.experience_match.score * settings.WEIGHT_EXPERIENCE_MATCH
            + breakdown.job_alignment.score * settings.WEIGHT_JOB_ALIGNMENT
            + breakdown.impact_and_achievements.score * settings.WEIGHT_IMPACT_AND_ACHIEVEMENTS
            + breakdown.education_match.score * settings.WEIGHT_EDUCATION_MATCH
        )

        overall = int(round(weighted_sum))
        # Ensure clamped boundary [0, 100]
        return max(0, min(100, overall))

    @classmethod
    def enrich_with_overall_score(cls, breakdown: LLMScoreBreakdown) -> ScoreBreakdown:
        """
        Enrich an untrusted LLMScoreBreakdown with the deterministic overall score,
        generating the commercial evidence_matrix and metrics dictionary.
        """
        overall_score = cls.calculate_overall_score(breakdown)

        evidence_matrix = []
        counts = {"strong": 0, "partial": 0, "missing": 0, "unsupported": 0}

        categories = [
            breakdown.skills_match,
            breakdown.experience_match,
            breakdown.education_match,
            breakdown.job_alignment,
            breakdown.impact_and_achievements,
        ]

        for cat in categories:
            if cat and cat.evidence:
                for ev in cat.evidence:
                    status = (
                        MatchStatus.DEMONSTRATED
                        if ev.assessment == MatchAssessment.MATCHED
                        else (
                            MatchStatus.PARTIAL
                            if ev.assessment == MatchAssessment.PARTIAL
                            else MatchStatus.MISSING
                        )
                    )
                    if status == MatchStatus.DEMONSTRATED:
                        counts["strong"] += 1
                    elif status == MatchStatus.PARTIAL:
                        counts["partial"] += 1
                    else:
                        counts["missing"] += 1

                    evidence_matrix.append(
                        RequirementEvaluation(
                            requirement=ev.requirement,
                            status=status,
                            evidence_found=ev.resume_excerpt,
                            action=ev.explanation,
                        )
                    )

        for gap in breakdown.identified_gaps:
            counts["missing"] += 1
            evidence_matrix.append(
                RequirementEvaluation(
                    requirement=gap.missing_requirement,
                    status=MatchStatus.MISSING,
                    evidence_found=None,
                    action=gap.explanation,
                )
            )

        return ScoreBreakdown(
            overall_score=overall_score,
            metrics=counts,
            evidence_matrix=evidence_matrix,
            skills_match=breakdown.skills_match,
            experience_match=breakdown.experience_match,
            education_match=breakdown.education_match,
            job_alignment=breakdown.job_alignment,
            impact_and_achievements=breakdown.impact_and_achievements,
            identified_gaps=breakdown.identified_gaps,
            strengths=breakdown.strengths,
            recommendations=breakdown.recommendations,
        )
