.PHONY: setup up down logs test verify tunnel

setup:
	@test -f backend/.env || cp backend/.env.example backend/.env
	@mkdir -p infra
	@test -f infra/seccomp-chrome.json || curl -fsSL https://raw.githubusercontent.com/microsoft/playwright/main/utils/docker/seccomp_profile.json -o infra/seccomp-chrome.json

up:
	docker compose --profile full up --build

down:
	docker compose down

logs:
	docker compose logs -f

test:
	docker compose --profile test run --rm api pytest

verify:
	docker compose config
	cd backend && pytest tests

tunnel:
	cloudflared tunnel --url http://localhost:8000
