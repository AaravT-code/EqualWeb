ARG PLAYWRIGHT_VERSION=1.49.1
FROM mcr.microsoft.com/playwright/python:v${PLAYWRIGHT_VERSION}-noble

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=pwuser:pwuser app ./app
COPY --chown=pwuser:pwuser vendor ./vendor
COPY --chown=pwuser:pwuser tests ./tests
USER pwuser
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
