from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CompanyBase(BaseModel):
    name: str
    slug: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    company_size: Optional[str] = None
    founded_year: Optional[int] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    company_size: Optional[str] = None
    founded_year: Optional[int] = None


class CompanyOut(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
