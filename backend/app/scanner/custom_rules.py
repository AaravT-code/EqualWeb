from bs4 import BeautifulSoup

from app.models.scan_models import Finding


def run_custom_rules(html: str) -> list[Finding]:
    soup = BeautifulSoup(html, "html.parser")
    findings: list[Finding] = []

    for button in soup.find_all("button"):
        if not button.get_text(strip=True) and not button.get("aria-label"):
            findings.append(Finding(
                rule_id="empty-button",
                impact="serious",
                description="Button has no accessible name",
                help="Buttons must have discernible text",
                recommendation="Add visible text, an aria-label, or aria-labelledby to the button.",
                target=["button"],
                html=str(button),
                source="custom",
            ))

    for link in soup.find_all("a", href=True):
        if not link.get_text(strip=True) and not link.get("aria-label"):
            findings.append(Finding(
                rule_id="empty-link",
                impact="serious",
                description="Link has no accessible name",
                help="Links must have discernible text",
                recommendation="Add link text, an aria-label, or alt text on the contained image.",
                target=["a"],
                html=str(link),
                source="custom",
            ))

    return findings
