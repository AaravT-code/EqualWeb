from app.models.scan_models import Finding


def normalize_axe_results(results: dict) -> list[Finding]:
    findings: list[Finding] = []
    for violation in results.get("violations", []):
        for node in violation.get("nodes", []):
            findings.append(Finding(
                rule_id=violation["id"],
                impact=node.get("impact") or violation.get("impact"),
                description=violation.get("description", violation.get("help", "Accessibility issue")),
                help=violation.get("help"),
                wcag=violation.get("tags", []),
                target=node.get("target", []),
                html=node.get("html"),
                source="axe",
            ))
    return findings
