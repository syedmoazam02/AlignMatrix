from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.app.models.evaluation import Evaluation
from backend.app.schemas.evaluation import (
    ResumeEvaluationRequest,
    EvaluationResponse,
    EvaluationStatus,
    ScoreBreakdown,
    EvaluationErrorResponse,
)


class EvaluationService:
    @staticmethod
    def create_evaluation(
        db: Session,
        user_id: int,
        request: ResumeEvaluationRequest,
    ) -> Evaluation:
        """
        Create and persist initial evaluation job record with status QUEUED.
        """
        evaluation = Evaluation(
            user_id=user_id,
            job_description=request.job_description,
            resume_text=request.resume_text,
            status=EvaluationStatus.QUEUED.value,
        )
        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)
        return evaluation

    @staticmethod
    def get_evaluation(
        db: Session,
        evaluation_id: int,
        user_id: int,
    ) -> Optional[Evaluation]:
        """
        Fetch an evaluation strictly scoped to the authenticated user.
        Guarantees tenant isolation: User A cannot retrieve User B's evaluation.
        """
        stmt = select(Evaluation).where(
            Evaluation.id == evaluation_id,
            Evaluation.user_id == user_id,
        )
        return db.scalar(stmt)

    @staticmethod
    def to_response(evaluation: Evaluation) -> EvaluationResponse:
        """
        Transform SQLAlchemy model to public Pydantic EvaluationResponse.
        """
        score_data = None
        if evaluation.result_json and evaluation.status == EvaluationStatus.COMPLETED.value:
            score_data = ScoreBreakdown.model_validate(evaluation.result_json)

        error_data = None
        if evaluation.error_code or evaluation.error_message:
            error_data = EvaluationErrorResponse(
                code=evaluation.error_code or "UNKNOWN_ERROR",
                message=evaluation.error_message or "An evaluation error occurred.",
            )

        return EvaluationResponse(
            id=evaluation.id,
            status=EvaluationStatus(evaluation.status),
            score=score_data,
            error=error_data,
            created_at=evaluation.created_at,
            completed_at=evaluation.completed_at,
        )
