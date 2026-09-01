from collections import Counter

from app.models.scan_models import Finding, Summary

PENALTIES = {"critical": 12, "serious": 7, "moderate": 3, "minor": 1}
IMPACT_ORDER = ["critical", "serious", "moderate", "minor"]


def _rank(impact: str) -> int:
    return IMPACT_ORDER.index(impact) if impact in IMPACT_ORDER else len(IMPACT_ORDER)


def _spread(count: int) -> float:
    """How much worse a rule is for being broken repeatedly.

    Capped deliberately. axe emits one finding per affected element, so a nav
    bar with 150 unlabelled links would otherwise contribute 150 x 7 = 1050
    penalty and drive every real-world site to exactly 0.
    """
    if count > 10:
        return 2.0
    if count > 1:
        return 1.5
    return 1.0


def calculate_score(findings: list[Finding]) -> int:
    """Penalise each distinct rule once, scaled by how widespread it is.

    Documented weighting per TRD 18: this is the product's automated
    accessibility score, not an official WCAG compliance score.
    """
    worst: dict[str, str] = {}
    counts: dict[str, int] = {}

    for finding in findings:
        rule = finding.rule_id
        counts[rule] = counts.get(rule, 0) + 1
        if rule not in worst or _rank(finding.impact) < _rank(worst[rule]):
            worst[rule] = finding.impact

    penalty = sum(
        PENALTIES.get(worst[rule], 0) * _spread(count) for rule, count in counts.items()
    )
    return max(0, round(100 - penalty))


def build_summary(findings: list[Finding]) -> Summary:
    counts = Counter(finding.impact for finding in findings)
    return Summary(
        critical=counts["critical"],
        serious=counts["serious"],
        moderate=counts["moderate"],
        minor=counts["minor"],
        manual_review=sum(finding.manual_review_required for finding in findings),
    )
