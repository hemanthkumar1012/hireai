from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Dict, Any, Optional

class ProfileBase(BaseModel):
    resume_text: Optional[str] = None
    skills: List[str] = []
    work_history: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    career_goals: Optional[str] = None
    career_insights: Dict[str, Any] = {}

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    resume_text: Optional[str] = None
    skills: Optional[List[str]] = None
    work_history: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    career_goals: Optional[str] = None
    career_insights: Optional[Dict[str, Any]] = None

class ProfileOut(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
