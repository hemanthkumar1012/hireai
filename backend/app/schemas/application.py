from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.schemas.job import JobOut
from app.schemas.user import UserOut


class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    seeker_id: int
    cover_letter: Optional[str] = None
    status: str
    match_score: int = 0
    match_explanation: Dict[str, Any] = {}
    interview_questions: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

    job: Optional[JobOut] = None
    seeker: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
