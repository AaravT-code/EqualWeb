import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    app.state.browser = await app.state.playwright.chromium.launch()
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
