from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.evaluation import (
    ResumeEvaluationRequest,
    EvaluationJobCreated,
    EvaluationResponse,
    EvaluationStatus,
)
from backend.app.services.evaluation import EvaluationService
from backend.app.workers.evaluator import process_evaluation_job

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


@router.post(
    "",
    response_model=EvaluationJobCreated,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit resume and job description for asynchronous evaluation",
)
def create_evaluation(
    request: ResumeEvaluationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> EvaluationJobCreated:
    """
    Submits evaluation request.
    Saves state as QUEUED and delegates work to background worker.
    Returns HTTP 202 Accepted immediately.
    """
    evaluation = EvaluationService.create_evaluation(
        db=db,
        user_id=current_user.id,
        request=request,
    )

    # CRITICAL: Pass ONLY the evaluation id to the worker, NEVER the request-scoped DB session!
    background_tasks.add_task(process_evaluation_job, evaluation.id)

    return EvaluationJobCreated(
        evaluation_id=evaluation.id,
        status=EvaluationStatus.QUEUED,
    )


@router.get(
    "/{evaluation_id}",
    response_model=EvaluationResponse,
    summary="Poll evaluation job status and retrieve evidence-backed scorecard",
)
def get_evaluation(
    evaluation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> EvaluationResponse:
    """
    Polls the current status of an evaluation job.
    Enforces tenant isolation: users cannot access evaluations belonging to other accounts.
    """
    evaluation = EvaluationService.get_evaluation(
        db=db,
        evaluation_id=evaluation_id,
        user_id=current_user.id,
    )

    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found.",
        )

    return EvaluationService.to_response(evaluation)
