from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional, Union


class JobBase(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    work_mode: str = "ONSITE"
    employment_type: str = "FULL_TIME"
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "USD"
    salary_range: Optional[str] = None
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    skills_needed: List[str] = []
    requirements: List[str] = []
    application_deadline: Optional[datetime] = None


class JobCreate(JobBase):
    status: str = "PUBLISHED"
    company_id: Optional[int] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None
    employment_type: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: Optional[str] = None
    salary_range: Optional[str] = None
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    skills_needed: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None
    application_deadline: Optional[datetime] = None

class JobOut(JobBase):
    id: int
    recruiter_id: Optional[int] = None
    company_id: Optional[int] = None
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    source: str = "applyright"
    apply_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedJobs(BaseModel):
    jobs: List[JobOut]
    total: int
    page: int
    page_size: int
    total_pages: int
