from app.ai.schemas import AIAnalysis


ALLOWED_SEVERITIES = {"critical", "serious", "moderate", "minor"}


def validate_ai_analysis(payload: dict) -> AIAnalysis:
    analysis = AIAnalysis.model_validate(payload)
    if analysis.severity not in ALLOWED_SEVERITIES:
        raise ValueError("AI response contains an unsupported severity")
    if len(analysis.explanation) > 4_000 or len(analysis.suggested_fix) > 4_000:
        raise ValueError("AI response is too large")
    return analysis
