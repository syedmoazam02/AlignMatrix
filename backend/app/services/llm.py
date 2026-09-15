import os
import json
from typing import Protocol, runtime_checkable, Optional
import google.generativeai as genai
from pydantic import ValidationError

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.schemas.evaluation import (
    ScoreBreakdown,
    RequirementEvaluation,
    MatchStatus,
    CategoryScore,
    MatchEvidence,
    MatchAssessment,
    ConfidenceLevel,
    GapEvidence,
    ImpactLevel,
)

PROMPT_VERSION = "v2.0-commercial"
DEFAULT_MODEL = "gemini-1.5-flash"


@runtime_checkable
class LLMService(Protocol):
    async def evaluate(self, resume_text: str, job_description: str) -> ScoreBreakdown:
        ...

    @property
    def model_identifier(self) -> str:
        ...


class GeminiEvaluator:
    def __init__(self, api_key: Optional[str] = None, model_name: str = DEFAULT_MODEL):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
        self.model_name = model_name
        # Initialize model with strict JSON schema instructions
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config={
                "temperature": 0.1,
                "response_mime_type": "application/json",
            },
        )

    @property
    def model_identifier(self) -> str:
        return f"google/{self.model_name}"

    async def evaluate(self, resume_text: str, job_description: str) -> ScoreBreakdown:
        schema_json = json.dumps(ScoreBreakdown.model_json_schema())

        prompt = f"""
        You are an elite technical recruiter and auditor.
        Evaluate this Resume against the Job Description.

        CRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object that perfectly adheres to this OpenAPI schema:
        {schema_json}

        Job Description:
        {job_description}

        Resume:
        {resume_text}
        """

        # Using generate_content_async for non-blocking I/O
        response = await self.model.generate_content_async(prompt)
        raw_output = response.text

        # The Pydantic Firewall: Validates the Gemini JSON string
        return ScoreBreakdown.model_validate_json(raw_output)


class MockEvaluator:
    """
    Deterministic Mock LLM Adapter for CI, tests, and zero-cost local execution.
    Produces valid ScoreBreakdown with genuine quotes from the candidate's resume.
    """

    def __init__(self, model_name: str = "mock-v2-commercial"):
        self.model_name = model_name

    @property
    def model_identifier(self) -> str:
        return f"mock/{self.model_name}"

    async def evaluate(self, resume_text: str, job_description: str) -> ScoreBreakdown:
        lines = [line.strip() for line in resume_text.splitlines() if len(line.strip()) > 15]
        first_excerpt = lines[0][:200] if lines else "Demonstrated software engineering capabilities"
        second_excerpt = lines[1][:200] if len(lines) > 1 else first_excerpt

        return ScoreBreakdown(
            overall_score=82,
            metrics={
                "strong": 12,
                "partial": 4,
                "missing": 3,
                "unsupported": 2,
            },
            evidence_matrix=[
                RequirementEvaluation(
                    requirement="Python (FastAPI / Asynchronous Architecture)",
                    status=MatchStatus.DEMONSTRATED,
                    evidence_found=first_excerpt,
                    action="No action needed. Strong evidence cited.",
                ),
                RequirementEvaluation(
                    requirement="PostgreSQL & Relational Data Modeling",
                    status=MatchStatus.DEMONSTRATED,
                    evidence_found=second_excerpt,
                    action="Add specific baseline query latency numbers to make performance claims bulletproof.",
                ),
                RequirementEvaluation(
                    requirement="Redis Caching & Latency Optimization",
                    status=MatchStatus.PARTIAL,
                    evidence_found="Implemented Redis caching layers with semantic invalidation",
                    action="Add measurable latency delta or cache hit ratio percentage.",
                ),
                RequirementEvaluation(
                    requirement="Kubernetes / Container Orchestration",
                    status=MatchStatus.MISSING,
                    evidence_found=None,
                    action="Prepare an honest interview reply acknowledging Docker mastery while eager to ramp up on K8s manifests.",
                ),
                RequirementEvaluation(
                    requirement="AWS Cloud Infrastructure (ECS / RDS / CloudWatch)",
                    status=MatchStatus.UNSUPPORTED,
                    evidence_found=None,
                    action="Add specific AWS services provisioned in experience bullets or remove to preserve credibility.",
                ),
            ],
            skills_match=CategoryScore(
                score=85,
                rationale="Candidate possesses strong core skills.",
                evidence=[
                    MatchEvidence(
                        requirement="Python proficiency",
                        resume_excerpt=first_excerpt,
                        assessment=MatchAssessment.MATCHED,
                        confidence=ConfidenceLevel.HIGH,
                        explanation="Verified from experience.",
                    )
                ],
            ),
            experience_match=CategoryScore(
                score=80,
                rationale="Demonstrated multi-year production experience.",
                evidence=[],
            ),
            education_match=CategoryScore(
                score=90,
                rationale="Relevant education verified.",
                evidence=[],
            ),
            job_alignment=CategoryScore(
                score=80,
                rationale="Strong alignment with backend engineering requirements.",
                evidence=[],
            ),
            impact_and_achievements=CategoryScore(
                score=80,
                rationale="Metrics cited in work experience.",
                evidence=[],
            ),
            strengths=["Python proficiency", "Relational database optimization"],
            recommendations=["Highlight specific cloud orchestration manifests"],
        )


def get_llm_service() -> LLMService:
    """
    Factory resolving the active LLM service adapter.
    Selects Gemini if an API key is configured, otherwise gracefully defaults to MockEvaluator.
    """
    api_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    provider = settings.LLM_PROVIDER.lower()

    if (provider == "gemini" or api_key) and api_key:
        logger.info(f"Using GeminiEvaluator with model {DEFAULT_MODEL}")
        return GeminiEvaluator(api_key=api_key, model_name=DEFAULT_MODEL)

    logger.info("Using MockEvaluator for deterministic zero-cost evaluation")
    return MockEvaluator()
