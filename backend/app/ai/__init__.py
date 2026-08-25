from app.core.config import settings
from app.ai.service import AIService
from app.ai.mock import MockAIService

def get_ai_service() -> AIService:
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        from app.ai.gemini import GeminiAIService
        return GeminiAIService(api_key=settings.GEMINI_API_KEY)
    return MockAIService()
