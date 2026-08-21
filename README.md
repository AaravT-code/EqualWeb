# AI Website Accessibility Auditor

Local Docker Compose MVP for auditing a public URL against WCAG 2.2-oriented automated checks.

## Start

1. Add the official Playwright seccomp profile to `infra/seccomp-chrome.json`.
2. Run `make setup` and add a Gemini key to `backend/.env` for live AI analysis.
3. Run `make up`, then open the frontend on `http://localhost:5173`.

The backend runs on `http://localhost:8000`. `axe-core` is vendored under MPL-2.0; see `backend/vendor/axe-core-LICENSE`.
