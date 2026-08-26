from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Dict, Any, Optional


class ProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[List[str]] = None
    work_history: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    career_goals: Optional[str] = None


class ProfileOut(BaseModel):
    id: int
    user_id: int
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_text: Optional[str] = None
    skills: List[str] = []
    work_history: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    career_goals: Optional[str] = None
    career_insights: Dict[str, Any] = {}
    profile_completion: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecruiterProfileUpdate(BaseModel):
    company_id: Optional[int] = None
    designation: Optional[str] = None
    phone: Optional[str] = None


class RecruiterProfileOut(BaseModel):
    id: int
    user_id: int
    company_id: Optional[int] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
