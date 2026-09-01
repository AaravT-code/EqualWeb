from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str = ""
    frontend_url: str = "http://localhost:5173"
    environment: str = "local"
    port: int = 8000
    max_concurrent_scans: int = 2
    scan_timeout_seconds: int = 45
    axe_script_path: str = "/app/vendor/axe.min.js"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
