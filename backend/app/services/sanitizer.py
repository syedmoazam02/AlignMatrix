import logging
from typing import List, Optional
import spacy
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

logger = logging.getLogger("alignmatrix.sanitizer")

TARGET_ENTITIES = [
    "PERSON",
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "LOCATION",
]


def _create_analyzer_engine() -> AnalyzerEngine:
    """
    Initializes Presidio AnalyzerEngine with the best available English spaCy model.
    Prioritizes en_core_web_lg, falls back gracefully to en_core_web_sm.
    """
    model_name = "en_core_web_lg" if spacy.util.is_package("en_core_web_lg") else "en_core_web_sm"
    logger.info(f"Initializing Presidio AnalyzerEngine with spaCy model '{model_name}'")

    nlp_config = {
        "nlp_engine_name": "spacy",
        "models": [{"lang_code": "en", "model_name": model_name}],
    }
    provider = NlpEngineProvider(nlp_configuration=nlp_config)
    nlp_engine = provider.create_engine()
    return AnalyzerEngine(nlp_engine=nlp_engine)


class PIISanitizer:
    """
    Microsoft Presidio PII Sanitization Engine.
    Detects and scrubs PERSON, EMAIL_ADDRESS, PHONE_NUMBER, and LOCATION entities,
    replacing them with standardized entity tags like <PERSON>, <EMAIL_ADDRESS>.
    """

    def __init__(
        self,
        analyzer: Optional[AnalyzerEngine] = None,
        anonymizer: Optional[AnonymizerEngine] = None,
    ):
        self.analyzer = analyzer or _create_analyzer_engine()
        self.anonymizer = anonymizer or AnonymizerEngine()

    def sanitize(self, text: str, entities: Optional[List[str]] = None) -> str:
        """
        Scrub PII from text while preserving document structure and technical terms.
        Replaces detected entities with <ENTITY_LABEL> (e.g., <PERSON>, <EMAIL_ADDRESS>).
        """
        if not text:
            return ""

        entities_to_detect = entities or TARGET_ENTITIES

        # Analyze text for PII entities
        results = self.analyzer.analyze(
            text=text,
            entities=entities_to_detect,
            language="en",
        )

        # Build operator mapping: replace each detected entity with <ENTITY_TYPE>
        operators = {
            entity: OperatorConfig("replace", {"new_value": f"<{entity}>"})
            for entity in entities_to_detect
        }

        # Anonymize text
        anonymized_result = self.anonymizer.anonymize(
            text=text,
            analyzer_results=results,
            operators=operators,
        )

        return anonymized_result.text


_default_sanitizer: Optional[PIISanitizer] = None


def get_pii_sanitizer() -> PIISanitizer:
    """
    Singleton factory for PIISanitizer.
    Reuses the initialized NLP pipelines for high throughput.
    """
    global _default_sanitizer
    if _default_sanitizer is None:
        _default_sanitizer = PIISanitizer()
    return _default_sanitizer
