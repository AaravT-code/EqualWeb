from pathlib import Path

from playwright.async_api import Page

# Restrict to WCAG success criteria. Without runOnly, axe also returns its
# "best-practice" rules -- region/landmark-one-main and friends -- which produce
# dozens of findings that are not WCAG failures and bury the real problems.
AXE_RUN = """async () => await axe.run(document, {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
  resultTypes: ['violations']
})"""


async def run_axe(page: Page, script_path: str) -> dict:
    # Fail here with a clear message rather than letting an empty or missing
    # bundle surface as a confusing "axe is not defined" ReferenceError from
    # inside the page.
    script = Path(script_path)
    if not script.is_file() or script.stat().st_size == 0:
        raise RuntimeError(f"axe-core bundle missing or empty at {script}")
    await page.add_script_tag(path=str(script))
    return await page.evaluate(AXE_RUN)
