from app.models.scan_models import Finding

PENALTIES = {"critical": 12, "serious": 7, "moderate": 3, "minor": 1}


def calculate_score(findings: list[Finding]) -> int:
    penalty = sum(PENALTIES.get(finding.impact or "", 0) for finding in findings)
    return max(0, 100 - penalty)
