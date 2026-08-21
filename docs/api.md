# API

`GET /health` returns service status.

`POST /api/scans` accepts `{ "url": "https://example.com" }` and returns a scan ID.

`GET /api/scans/{scan_id}` returns queued, rendering, scanning, analyzing, completed, or failed scan state.
