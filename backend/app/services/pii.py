import re


class PIIService:
    """
    Service responsible for detecting and redacting Personally Identifiable Information (PII)
    prior to submitting resume and job description content to external AI providers.
    """

    # Email pattern
    EMAIL_PATTERN = re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        re.IGNORECASE,
    )

    # Phone numbers (supports US, UK, international variations, extensions)
    PHONE_PATTERN = re.compile(
        r"(?:(?:\+?\d{1,3}[-.\s*]?)?(?:\(?\d{3}\)?[-.\s*]?)?\d{3}[-.\s*]?\d{4}|\b\d{10}\b)",
    )

    # Street and postal addresses
    ADDRESS_PATTERN = re.compile(
        r"\b\d{1,5}\s+[A-Za-z0-9\s.,]{2,30}\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way)\b",
        re.IGNORECASE,
    )

    # Explicit Name headers (e.g., "Candidate Name: John Doe", "Full Name: Alice Smith")
    EXPLICIT_NAME_PATTERN = re.compile(
        r"(?:Candidate\s+Name|Full\s+Name|Name)\s*:\s*([A-Za-z][A-Za-z \t'-]{1,39})",
        re.IGNORECASE,
    )

    # Social / Personal Profiles
    SOCIAL_URL_PATTERN = re.compile(
        r"https?://(?:www\.)?(?:linkedin\.com/in|github\.com|twitter\.com|x\.com)/[A-Za-z0-9_-]+",
        re.IGNORECASE,
    )

    @classmethod
    def redact(cls, text: str) -> str:
        """
        Scrub PII from text while maintaining whitespace and structure for LLM parsing.
        """
        if not text:
            return ""

        # 1. Redact Emails
        redacted = cls.EMAIL_PATTERN.sub("[REDACTED_EMAIL]", text)

        # 2. Redact Phone Numbers
        redacted = cls.PHONE_PATTERN.sub("[REDACTED_PHONE]", redacted)

        # 3. Redact Physical Addresses
        redacted = cls.ADDRESS_PATTERN.sub("[REDACTED_ADDRESS]", redacted)

        # 4. Redact Social URLs
        redacted = cls.SOCIAL_URL_PATTERN.sub("[REDACTED_PROFILE_URL]", redacted)

        # 5. Redact explicit name tags
        redacted = cls.EXPLICIT_NAME_PATTERN.sub(r"Name: [REDACTED_NAME]", redacted)

        return redacted
