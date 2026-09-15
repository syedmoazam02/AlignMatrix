import logging
import sys
import json
from typing import Any, Dict
from datetime import datetime, timezone


class StructuredJsonFormatter(logging.Formatter):
    """
    Format logs as structured JSON omitting raw resume data or sensitive secrets.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include structured extra fields if provided
        for key in (
            "evaluation_id",
            "request_id",
            "user_id",
            "status",
            "duration_ms",
            "error_code",
            "model_name",
            "prompt_version",
            "attempt_count",
        ):
            if hasattr(record, key):
                log_entry[key] = getattr(record, key)

        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_entry)


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("alignmatrix")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredJsonFormatter())
        logger.addHandler(handler)

    logger.propagate = False
    return logger


logger = setup_logging()
