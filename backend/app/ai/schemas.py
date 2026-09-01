from pydantic import BaseModel, Field


class AIAnalysis(BaseModel):
    severity: str
    explanation: str
    affected_users: list[str]
    recommendation: str
    suggested_fix: str
    confidence: float = Field(ge=0, le=1)
    manual_review_required: bool
