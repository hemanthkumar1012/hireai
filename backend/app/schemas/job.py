from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Literal, Optional

JobStatus = Literal["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]

class JobBase(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    salary_range: Optional[str] = None
    skills_needed: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    skills_needed: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    is_active: Optional[bool] = None
    status: Optional[JobStatus] = None

class JobOut(JobBase):
    id: int
    recruiter_id: int
    is_active: bool
    status: JobStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
