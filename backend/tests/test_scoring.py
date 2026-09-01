from app.models.scan_models import Finding
from app.scoring.accessibility_score import calculate_score


def test_score_uses_deterministic_penalties():
    findings = [
        Finding(rule_id="one", impact="critical", description="x", source="axe"),
        Finding(rule_id="two", impact="minor", description="x", source="custom"),
    ]
    assert calculate_score(findings) == 87
