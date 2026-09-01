from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, Field, HttpUrl


class ScanStatus(str, Enum):
    QUEUED = "queued"
    RENDERING = "rendering"
    SCANNING = "scanning"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


class CreateScanRequest(BaseModel):
    url: HttpUrl


class CreateScanResponse(BaseModel):
    scan_id: str
    status: ScanStatus


class Finding(BaseModel):
    rule_id: str
    impact: str = "minor"
    description: str
    help: str = ""
    help_url: str | None = None
    wcag: list[str] = Field(default_factory=list)
    target: list[str] = Field(default_factory=list)
    html: str = ""
    source: str = "axe"
    explanation: str = ""
    recommendation: str = ""
    manual_review_required: bool = False


class Summary(BaseModel):
    critical: int = 0
    serious: int = 0
    moderate: int = 0
    minor: int = 0
    manual_review: int = 0


class ScanRecord(BaseModel):
    scan_id: str = ""
    url: str
    status: ScanStatus = ScanStatus.QUEUED
    score: int | None = None
    summary: Summary = Field(default_factory=Summary)
    issues: list[Finding] = Field(default_factory=list)
    ai_available: bool = False
    ai_message: str | None = None
    error: str | None = None

    @classmethod
    def new(cls, url: str) -> "ScanRecord":
        return cls(scan_id=f"scan_{uuid4().hex[:12]}", url=url)
