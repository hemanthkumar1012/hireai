from app.core.config import settings
from app.ai.service import AIService
from app.ai.mock import MockAIService
from app.ai.gemini import GeminiAIService

def get_ai_service() -> AIService:
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        return GeminiAIService(api_key=settings.GEMINI_API_KEY)
    return MockAIService()
