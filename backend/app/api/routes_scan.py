import asyncio
import ipaddress
import socket
from urllib.parse import urlparse

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from app.models.scan_models import CreateScanRequest, CreateScanResponse, ScanRecord, ScanStatus
from app.scoring.accessibility_score import build_summary, calculate_score
from app.scanner.axe import run_axe
from app.scanner.custom_rules import run_custom_rules
from app.scanner.normalizer import normalize_axe_results

router = APIRouter(prefix="/api/scans", tags=["scans"])
BLOCKED_NAMES = {"api", "web", "fixtures", "localhost"}


async def validate_public_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise HTTPException(422, "Only public HTTP(S) URLs are supported")
    if parsed.hostname in BLOCKED_NAMES or parsed.hostname.endswith(".internal"):
        raise HTTPException(422, "Internal hosts are not allowed")
    try:
        addresses = await asyncio.get_running_loop().run_in_executor(None, socket.getaddrinfo, parsed.hostname, None)
    except socket.gaierror as exc:
        raise HTTPException(422, "Hostname could not be resolved") from exc
    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if not ip.is_global:
            raise HTTPException(422, "Private or reserved addresses are not allowed")


async def perform_scan(request: Request, record: ScanRecord) -> None:
    settings = request.app.state.settings
    record.status = ScanStatus.RENDERING
    try:
        async with request.app.state.scan_semaphore:
            context = await request.app.state.browser.new_context()
            try:
                page = await context.new_page()
                await page.goto(record.url, wait_until="networkidle", timeout=settings.scan_timeout_seconds * 1000)
                record.status = ScanStatus.SCANNING
                axe_results = await run_axe(page, settings.axe_script_path)
                axe_findings = normalize_axe_results(axe_results)
                # axe already covers link-name and button-name. Without this, every
                # unlabelled link is reported twice -- once by axe, once by us.
                already_flagged = {finding.html for finding in axe_findings if finding.html}
                custom_findings = [
                    finding
                    for finding in run_custom_rules(await page.content())
                    if finding.html not in already_flagged
                ]
                record.issues = axe_findings + custom_findings
                record.status = ScanStatus.ANALYZING
                # AI enrichment is deliberately optional: a failed/missing key never blocks Layer 1 results.
                record.score = calculate_score(record.issues)
                record.summary = build_summary(record.issues)
                record.ai_available = False
                record.ai_message = "AI analysis is unavailable; deterministic axe-core results are shown."
                record.status = ScanStatus.COMPLETED
            finally:
                await context.close()
    except Exception as exc:
        record.status = ScanStatus.FAILED
        record.error = str(exc)


@router.post("", response_model=CreateScanResponse, status_code=202)
async def create_scan(payload: CreateScanRequest, request: Request, background_tasks: BackgroundTasks) -> CreateScanResponse:
    await validate_public_url(str(payload.url))
    record = ScanRecord.new(str(payload.url))
    request.app.state.scans[record.scan_id] = record
    background_tasks.add_task(perform_scan, request, record)
    return CreateScanResponse(scan_id=record.scan_id, status=record.status)


@router.get("/{scan_id}", response_model=ScanRecord)
async def get_scan(scan_id: str, request: Request) -> ScanRecord:
    record = request.app.state.scans.get(scan_id)
    if not record:
        raise HTTPException(404, "Scan not found")
    return record
