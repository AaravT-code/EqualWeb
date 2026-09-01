from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, HttpUrl


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
    impact: str | None = None
    description: str
    help: str | None = None
    wcag: list[str] = []
    target: list[str] = []
    html: str | None = None
    source: str


class ScanRecord(BaseModel):
    scan_id: str = ""
    url: str
    status: ScanStatus = ScanStatus.QUEUED
    score: int | None = None
    issues: list[Finding] = []
    error: str | None = None

    @classmethod
    def new(cls, url: str) -> "ScanRecord":
        return cls(scan_id=f"scan_{uuid4().hex[:12]}", url=url)
