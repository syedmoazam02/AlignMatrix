from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime


# ---------------------------------------------------------------------------
# Core Commercial Pydantic Contract
# ---------------------------------------------------------------------------


class EvaluationStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class MatchStatus(str, Enum):
    DEMONSTRATED = "Demonstrated"
    PARTIAL = "Partial Match"
    MISSING = "Missing"
    UNSUPPORTED = "Unsupported"


class RequirementEvaluation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    requirement: str = Field(
        ...,
        description="The core skill or responsibility from the JD",
    )
    status: MatchStatus = Field(
        ...,
        description="The level of evidence found in the resume",
    )
    evidence_found: Optional[str] = Field(
        None,
        min_length=1,
        max_length=500,
        description="Exact quote from the resume. Null if missing.",
    )
    action: str = Field(
        ...,
        description="Specific advice for the user (e.g., 'Add latency metrics')",
    )


# ---------------------------------------------------------------------------
# Supplementary Types for Categorized Evidence
# ---------------------------------------------------------------------------


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ImpactLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class MatchAssessment(str, Enum):
    MATCHED = "matched"
    PARTIAL = "partial"
    MISSING = "missing"


class MatchEvidence(BaseModel):
    model_config = ConfigDict(extra="forbid")

    requirement: str = Field(min_length=1, max_length=500)
    resume_excerpt: Optional[str] = Field(default=None, max_length=500)
    assessment: MatchAssessment
    confidence: ConfidenceLevel
    explanation: str = Field(min_length=1, max_length=1000)


class GapEvidence(BaseModel):
    model_config = ConfigDict(extra="forbid")

    missing_requirement: str = Field(min_length=1, max_length=500)
    impact: ImpactLevel
    explanation: str = Field(min_length=1, max_length=1000)


class CategoryScore(BaseModel):
    model_config = ConfigDict(extra="forbid")

    score: int = Field(ge=0, le=100)
    rationale: str = Field(min_length=1, max_length=1500)
    evidence: List[MatchEvidence] = Field(default_factory=list)


class LLMScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="forbid")

    skills_match: CategoryScore
    experience_match: CategoryScore
    education_match: CategoryScore
    job_alignment: CategoryScore
    impact_and_achievements: CategoryScore
    identified_gaps: List[GapEvidence] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="ignore")

    overall_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Deterministic overall score calculated by the backend",
    )
    metrics: Dict[str, int] = Field(
        default_factory=lambda: {"strong": 12, "partial": 4, "missing": 3, "unsupported": 2},
        description="Count of matches e.g., {'strong': 12, 'partial': 4, 'missing': 3, 'unsupported': 2}",
    )
    evidence_matrix: List[RequirementEvaluation] = Field(
        default_factory=list,
        description="Array powering the UI table",
    )

    # Optional category matches for granular scoring calculations
    skills_match: Optional[CategoryScore] = None
    experience_match: Optional[CategoryScore] = None
    education_match: Optional[CategoryScore] = None
    job_alignment: Optional[CategoryScore] = None
    impact_and_achievements: Optional[CategoryScore] = None
    identified_gaps: List[GapEvidence] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# API Transport Contracts (FastAPI Request/Response Schemas)
# ---------------------------------------------------------------------------


class ResumeEvaluationRequest(BaseModel):
    job_description: str = Field(
        min_length=100,
        max_length=30000,
        description="Full text of the target job description",
    )
    resume_text: str = Field(
        min_length=50,
        max_length=50000,
        description="Full text of the candidate's resume",
    )


class EvaluationJobCreated(BaseModel):
    evaluation_id: int
    status: EvaluationStatus


class EvaluationErrorResponse(BaseModel):
    code: str
    message: str


class EvaluationResponse(BaseModel):
    id: int
    status: EvaluationStatus
    score: Optional[ScoreBreakdown] = None
    error: Optional[EvaluationErrorResponse] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
