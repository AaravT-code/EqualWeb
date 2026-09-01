from playwright.async_api import Browser


async def render_page(browser: Browser, url: str, timeout_ms: int) -> tuple[str, object]:
    # Many real sites ship a strict script-src CSP, which blocks the axe-core
    # <script> that add_script_tag injects and produces the same
    # "axe is not defined" error even when the bundle is present.
    context = await browser.new_context(bypass_csp=True)
    try:
        page = await context.new_page()
        await page.goto(url, wait_until="networkidle", timeout=timeout_ms)
        return await page.content(), page
    except Exception:
        await context.close()
        raise
