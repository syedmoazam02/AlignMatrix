from typing import List
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    # Database: SQLite fallback for local developer velocity, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./alignmatrix.db"

    # LLM Provider Configuration (mock, openai, anthropic, gemini)
    LLM_PROVIDER: str = "mock"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL_NAME: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL_NAME: str = "claude-3-5-sonnet-20241022"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL_NAME: str = "gemini-1.5-pro"
    LLM_TIMEOUT_SECONDS: int = 30
    PROMPT_VERSION: str = "v1.0.0"

    # Input Boundaries (DoS and Cost Defense)
    MAX_RESUME_CHARS: int = 50000
    MAX_JOB_DESCRIPTION_CHARS: int = 30000
    MIN_RESUME_CHARS: int = 50
    MIN_JOB_DESCRIPTION_CHARS: int = 100

    # Deterministic Scoring Weights (Total must sum to 1.0)
    WEIGHT_SKILLS_MATCH: float = 0.30
    WEIGHT_EXPERIENCE_MATCH: float = 0.25
    WEIGHT_JOB_ALIGNMENT: float = 0.20
    WEIGHT_IMPACT_AND_ACHIEVEMENTS: float = 0.15
    WEIGHT_EDUCATION_MATCH: float = 0.10

    # CORS
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["*"])

    @model_validator(mode="after")
    def validate_weights(self) -> "Settings":
        total_weight = round(
            self.WEIGHT_SKILLS_MATCH
            + self.WEIGHT_EXPERIENCE_MATCH
            + self.WEIGHT_JOB_ALIGNMENT
            + self.WEIGHT_IMPACT_AND_ACHIEVEMENTS
            + self.WEIGHT_EDUCATION_MATCH,
            4,
        )
        if total_weight != 1.0:
            raise ValueError(f"Category weights must sum to 1.0, got {total_weight}")
        return self


settings = Settings()
