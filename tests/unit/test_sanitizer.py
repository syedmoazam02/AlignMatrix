import pytest
from backend.app.services.sanitizer import PIISanitizer, get_pii_sanitizer


def test_pii_sanitizer_redacts_name_and_email():
    sanitizer = get_pii_sanitizer()

    sample_text = "My name is John Doe and my email is john@example.com"
    sanitized = sanitizer.sanitize(sample_text)

    # Must scrub the person's name and email
    assert "John Doe" not in sanitized
    assert "john@example.com" not in sanitized
    assert "<PERSON>" in sanitized
    assert "<EMAIL_ADDRESS>" in sanitized


def test_pii_sanitizer_redacts_phone_and_location():
    sanitizer = get_pii_sanitizer()

    sample_text = "Contact Alice Smith at 555-867-5309 living in San Francisco, California."
    sanitized = sanitizer.sanitize(sample_text)

    assert "Alice Smith" not in sanitized
    assert "555-867-5309" not in sanitized
    assert "<PERSON>" in sanitized
    assert "<PHONE_NUMBER>" in sanitized


def test_pii_sanitizer_preserves_technical_skills():
    sanitizer = get_pii_sanitizer()

    resume_text = (
        "Candidate John Doe. Built Python and FastAPI microservices with PostgreSQL on AWS."
    )
    sanitized = sanitizer.sanitize(resume_text)

    assert "John Doe" not in sanitized
    assert "Python" in sanitized
    assert "FastAPI" in sanitized
    assert "PostgreSQL" in sanitized
    assert "AWS" in sanitized

def test_pii_sanitizer_redacts_social_profiles():
    sanitizer = get_pii_sanitizer()

    sample_text = "View my work at github.com/johndoe and my profile at https://www.linkedin.com/in/john-doe"
    sanitized = sanitizer.sanitize(sample_text)

    assert "github.com/johndoe" not in sanitized
    assert "https://www.linkedin.com/in/john-doe" not in sanitized
    assert "<SOCIAL_PROFILE>" in sanitized
