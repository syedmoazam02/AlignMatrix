import os
import time
from datetime import datetime, timezone
from pydantic import ValidationError

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.db.session import get_worker_db
from backend.app.models.evaluation import Evaluation
from backend.app.schemas.evaluation import EvaluationStatus, ScoreBreakdown
from backend.app.services.llm import get_llm_service, GeminiEvaluator, MockEvaluator
from backend.app.services.pii import PIIService
from backend.app.services.sanitizer import get_pii_sanitizer


def _verify_evidence_excerpts(resume_text: str, breakdown: ScoreBreakdown) -> None:
    """
    Programmatic evidence verification.
    Verifies that cited excerpts actually exist in the candidate's resume.
    Normalizes whitespace to prevent false negatives from formatting discrepancies.
    """
    normalized_resume = " ".join(resume_text.lower().split())

    for item in breakdown.evidence_matrix:
        if item.evidence_found:
            normalized_excerpt = " ".join(item.evidence_found.lower().split())
            if normalized_excerpt not in normalized_resume:
                logger.warning(
                    f"Evidence citation not found in original resume: '{item.evidence_found[:80]}...'"
                )


async def process_evaluation_job(evaluation_id: int) -> None:
    """
    Asynchronous background worker task.
    CRITICAL INVARIANTS:
    1. Owns its independent SessionLocal DB session; never reuses request-scoped sessions.
    2. Runs PII redaction before calling the LLM provider.
    3. LLM output is treated as untrusted and passed through Pydantic v2 firewall.
    4. Deterministic scoring math computed by backend, never by LLM.
    5. Safe public error codes written to DB, full tracebacks logged internally.
    """
    start_time = time.perf_counter()
    db = get_worker_db()

    try:
        evaluation = db.get(Evaluation, evaluation_id)
        if not evaluation:
            logger.error(f"Worker could not find evaluation id={evaluation_id}")
            return

        # Move state to PROCESSING
        evaluation.status = EvaluationStatus.PROCESSING.value
        evaluation.attempt_count += 1
        db.commit()

        # Step 1: Pre-LLM PII Redaction via Microsoft Presidio
        sanitizer = get_pii_sanitizer()
        redacted_resume = sanitizer.sanitize(evaluation.resume_text)
        evaluation.redacted_resume_text = redacted_resume
        db.commit()

        # Step 2: Invoke Zero-Trust LLM Service (GeminiEvaluator if GEMINI_API_KEY is present, else MockEvaluator)
        llm_service = get_llm_service()
        model_name = llm_service.model_identifier

        raw_breakdown = await llm_service.evaluate(
            resume_text=redacted_resume,
            job_description=evaluation.job_description,
        )

        # Step 3: Strict Pydantic Firewall Validation
        scorecard = ScoreBreakdown.model_validate(raw_breakdown)

        # Step 4: Programmatic Ground-Truth Evidence Verification
        _verify_evidence_excerpts(evaluation.resume_text, scorecard)

        # Step 5: Persist Completed Scorecard
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        evaluation.status = EvaluationStatus.COMPLETED.value
        evaluation.overall_score = scorecard.overall_score
        evaluation.result_json = scorecard.model_dump(mode="json")
        evaluation.prompt_version = settings.PROMPT_VERSION
        evaluation.model_name = model_name
        evaluation.completed_at = datetime.now(timezone.utc)
        evaluation.error_code = None
        evaluation.error_message = None

        db.commit()

        logger.info(
            f"Evaluation {evaluation_id} completed successfully with overall score {scorecard.overall_score}",
            extra={
                "evaluation_id": evaluation_id,
                "user_id": evaluation.user_id,
                "status": evaluation.status,
                "duration_ms": duration_ms,
                "model_name": model_name,
                "prompt_version": settings.PROMPT_VERSION,
                "attempt_count": evaluation.attempt_count,
            },
        )

    except ValidationError as val_err:
        db.rollback()
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        logger.error(
            f"Evaluation {evaluation_id} failed Pydantic schema validation: {val_err}",
            exc_info=True,
            extra={
                "evaluation_id": evaluation_id,
                "error_code": "VALIDATION_FAILED",
                "duration_ms": duration_ms,
            },
        )
        try:
            evaluation = db.get(Evaluation, evaluation_id)
            if evaluation:
                evaluation.status = EvaluationStatus.FAILED.value
                evaluation.error_code = "VALIDATION_FAILED"
                evaluation.error_message = "Evaluation output did not meet the required schema contract."
                db.commit()
        except Exception as write_err:
            logger.error(f"Failed to record validation failure state: {write_err}")

    except Exception as exc:
        db.rollback()
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        logger.error(
            f"Evaluation {evaluation_id} failed with internal error: {exc}",
            exc_info=True,
            extra={
                "evaluation_id": evaluation_id,
                "error_code": "INTERNAL_ERROR",
                "duration_ms": duration_ms,
            },
        )
        try:
            evaluation = db.get(Evaluation, evaluation_id)
            if evaluation:
                evaluation.status = EvaluationStatus.FAILED.value
                evaluation.error_code = "INTERNAL_ERROR"
                evaluation.error_message = "An unexpected error occurred during evaluation processing."
                db.commit()
        except Exception as write_err:
            logger.error(f"Failed to record failure state: {write_err}")

    finally:
        db.close()
