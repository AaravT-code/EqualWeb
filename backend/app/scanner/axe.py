from pathlib import Path

from playwright.async_api import Page


async def run_axe(page: Page, script_path: str) -> dict:
    await page.add_script_tag(path=str(Path(script_path)))
    return await page.evaluate("async () => await axe.run()")
