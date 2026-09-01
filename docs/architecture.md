# Architecture

React/Vite runs separately from the FastAPI API. The API renders an approved public URL with sandboxed Playwright Chromium, runs vendored axe-core plus custom rules, calculates a deterministic automated accessibility score, and returns the report to the dashboard. Gemini enrichment is intentionally optional so deterministic scanning still works if it is unavailable.
