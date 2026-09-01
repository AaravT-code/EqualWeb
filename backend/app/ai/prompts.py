def build_finding_prompt(finding: dict, context: dict) -> str:
    return (
        "Explain this accessibility finding in plain language and return only JSON matching "
        "severity, explanation, affected_users, recommendation, suggested_fix, confidence, "
        f"and manual_review_required. Finding: {finding}. Context: {context}"
    )
