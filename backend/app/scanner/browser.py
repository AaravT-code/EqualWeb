from playwright.async_api import Browser


async def render_page(browser: Browser, url: str, timeout_ms: int) -> tuple[str, object]:
    context = await browser.new_context()
    try:
        page = await context.new_page()
        await page.goto(url, wait_until="networkidle", timeout=timeout_ms)
        return await page.content(), page
    except Exception:
        await context.close()
        raise
