from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.schemas.job import JobOut
from app.schemas.user import UserOut

class ApplicationBase(BaseModel):
    status: str = "applied"
    match_score: int = 0
    match_explanation: Dict[str, Any] = {}
    interview_questions: List[Dict[str, Any]] = []

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    match_score: Optional[int] = None
    match_explanation: Optional[Dict[str, Any]] = None
    interview_questions: Optional[List[Dict[str, Any]]] = None

class ApplicationOut(ApplicationBase):
    id: int
    job_id: int
    seeker_id: int
    created_at: datetime
    updated_at: datetime
    
    job: Optional[JobOut] = None
    seeker: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
