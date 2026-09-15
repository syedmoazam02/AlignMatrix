import pytest
from backend.app.services.pii import PIIService


def test_redact_email_addresses():
    raw = "Contact the applicant at john.doe@example.com or jane_smith123@work.co.uk."
    redacted = PIIService.redact(raw)
    assert "john.doe@example.com" not in redacted
    assert "jane_smith123@work.co.uk" not in redacted
    assert "[REDACTED_EMAIL]" in redacted


def test_redact_phone_numbers():
    raw = "Mobile: +1 (555) 349-2041, Office: 212-555-0199, Direct: 9876543210."
    redacted = PIIService.redact(raw)
    assert "+1 (555) 349-2041" not in redacted
    assert "212-555-0199" not in redacted
    assert "9876543210" not in redacted
    assert "[REDACTED_PHONE]" in redacted


def test_redact_physical_addresses():
    raw = "Residing at 742 Evergreen Terrace, Springfield and 100 Main Street."
    redacted = PIIService.redact(raw)
    assert "100 Main Street" not in redacted
    assert "[REDACTED_ADDRESS]" in redacted


def test_redact_explicit_name_tags():
    raw = "Candidate Name: Alex Johnson\nRole: Lead Engineer"
    redacted = PIIService.redact(raw)
    assert "Alex Johnson" not in redacted
    assert "Name: [REDACTED_NAME]" in redacted
    assert "Role: Lead Engineer" in redacted


def test_preserve_technical_skills_and_history():
    raw = (
        "Candidate Name: John Doe\n"
        "Email: john@dev.io\n"
        "Senior Python Engineer with 6 years experience in FastAPI, PostgreSQL, and AWS."
    )
    redacted = PIIService.redact(raw)
    assert "John Doe" not in redacted
    assert "john@dev.io" not in redacted
    assert "Senior Python Engineer with 6 years experience in FastAPI, PostgreSQL, and AWS." in redacted
