from app.ai.schemas import AIAnalysis


class GeminiUnavailable(RuntimeError):
    pass


class GeminiClient:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def analyze(self, finding: dict, context: dict) -> AIAnalysis:
        if not self.api_key:
            raise GeminiUnavailable("AI analysis unavailable")
        # Keep provider wiring isolated here. The deterministic scanner remains usable without it.
        raise GeminiUnavailable("Gemini provider integration has not been configured")
