from app.models.scan_models import Finding


def normalize_axe_results(results: dict) -> list[Finding]:
    findings: list[Finding] = []
    for violation in results.get("violations", []):
        tags = violation.get("tags", [])
        wcag = sorted(
            {
                tag.removeprefix("wcag")
                for tag in tags
                if tag.startswith("wcag") and tag[4:].isdigit()
            }
        )
        for node in violation.get("nodes", []):
            findings.append(
                Finding(
                    rule_id=violation.get("id", "unknown"),
                    impact=node.get("impact") or violation.get("impact") or "minor",
                    description=violation.get("description", "Accessibility issue detected"),
                    help=violation.get("help", "Review this element"),
                    help_url=violation.get("helpUrl"),
                    wcag=wcag,
                    target=[str(item) for item in node.get("target", [])],
                    html=(node.get("html") or "")[:1200],
                    source="axe",
                    # axe explains why THIS element failed; far more useful than
                    # the generic rule description the UI falls back to.
                    explanation=(
                        node.get("failureSummary") or violation.get("description", "")
                    ).strip(),
                    recommendation=violation.get("help", "Review and correct this element."),
                )
            )
    return findings
