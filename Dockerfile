# Single-service image: builds the React app, then serves it from FastAPI
# alongside the API. One Render web service, one URL, no CORS.
#
# Build context is the REPO ROOT (both frontend/ and backend/ are needed).
# backend/Dockerfile is left untouched so local docker-compose keeps working.

# ---------------------------------------------------------------- stage 1: UI
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
# Empty = same-origin. The API is served by this very container, so the
# browser should call /health and /api/scans as relative paths.
ENV VITE_API_URL=""
RUN npm run build

# ------------------------------------------------------------- stage 2: API
ARG PLAYWRIGHT_VERSION=1.49.1
FROM mcr.microsoft.com/playwright/python:v${PLAYWRIGHT_VERSION}-noble

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=pwuser:pwuser backend/app ./app
COPY --chown=pwuser:pwuser backend/vendor ./vendor
COPY --chown=pwuser:pwuser backend/tests ./tests

# The built UI. main.py mounts this at "/" when the directory exists.
COPY --from=web --chown=pwuser:pwuser /web/dist ./static

USER pwuser
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
