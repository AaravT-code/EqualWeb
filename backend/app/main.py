import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from playwright.async_api import async_playwright

from app.api.routes_health import router as health_router
from app.api.routes_scan import router as scan_router
from app.config.settings import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.settings = settings
    app.state.scans = {}
    app.state.scan_semaphore = asyncio.Semaphore(settings.max_concurrent_scans)
    app.state.playwright = await async_playwright().start()
    # Render gives no control over /dev/shm, which Docker defaults to 64 MB.
    # Chromium uses it for rendering and its renderer crashes on image-heavy
    # pages below that, so route shared memory to /tmp instead.
    app.state.browser = await app.state.playwright.chromium.launch(
        args=["--disable-dev-shm-usage"]
    )
    yield
    await app.state.browser.close()
    await app.state.playwright.stop()


settings = get_settings()
app = FastAPI(title="Accessibility Auditor API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(health_router)
app.include_router(scan_router)

# Serve the built React app from this same service when it is present. The root
# Dockerfile bakes it into /app/static; local development has no such directory
# and is unaffected. Mounted last so it can never shadow /health or /api/*.
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="web")
