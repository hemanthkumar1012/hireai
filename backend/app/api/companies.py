from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import re
from app.core.database import get_db
from app.models.user import User
from app.models.company import Company
from app.models.recruiter_profile import RecruiterProfile
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut
from app.api import deps

router = APIRouter()


def _generate_slug(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug


@router.post("/", response_model=CompanyOut, status_code=status.HTTP_201_CREATED)
def create_company(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    slug = data.slug or _generate_slug(data.name)
    # Ensure unique slug
    existing = db.query(Company).filter(Company.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A company with this slug already exists")

    company = Company(
        name=data.name,
        slug=slug,
        logo_url=data.logo_url,
        website=data.website,
        industry=data.industry,
        description=data.description,
        location=data.location,
        company_size=data.company_size,
        founded_year=data.founded_year,
    )
    db.add(company)
    db.commit()
    db.refresh(company)

    # Link recruiter to company
    rec_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not rec_profile:
        rec_profile = RecruiterProfile(user_id=current_user.id, company_id=company.id)
        db.add(rec_profile)
    else:
        rec_profile.company_id = company.id
    db.commit()

    return company


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.put("/{company_id}", response_model=CompanyOut)
def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    # Authorization: recruiter must belong to this company
    rec_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.user_id == current_user.id,
        RecruiterProfile.company_id == company_id,
    ).first()
    if not rec_profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this company")

    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(company, field, val)
    db.commit()
    db.refresh(company)
    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    rec_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.user_id == current_user.id,
        RecruiterProfile.company_id == company_id,
    ).first()
    if not rec_profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(company)
    db.commit()
    return None
