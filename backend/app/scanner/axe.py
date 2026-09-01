from pathlib import Path

from playwright.async_api import Page


async def run_axe(page: Page, script_path: str) -> dict:
    # Fail here with a clear message rather than letting an empty or missing
    # bundle surface as a confusing "axe is not defined" ReferenceError from
    # inside the page.
    script = Path(script_path)
    if not script.is_file() or script.stat().st_size == 0:
        raise RuntimeError(f"axe-core bundle missing or empty at {script}")
    await page.add_script_tag(path=str(script))
    return await page.evaluate("async () => await axe.run()")
