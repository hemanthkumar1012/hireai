from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.user import User
from app.models.profile import JobSeekerProfile
from app.schemas.profile import ProfileUpdate, ProfileOut
from app.api import deps
from app.ai import get_ai_service

router = APIRouter()

class ResumeParsePayload(BaseModel):
    resume_text: str

class GapAnalysisPayload(BaseModel):
    target_role: str
    target_skills: list[str]

@router.get("/me", response_model=ProfileOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == current_user.id).first()
    if not profile:
        profile = JobSeekerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/me", response_model=ProfileOut)
def update_my_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == current_user.id).first()
    if not profile:
        profile = JobSeekerProfile(user_id=current_user.id)
        db.add(profile)
        
    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)
        
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/me/parse-resume", response_model=ProfileOut)
def parse_my_resume(
    payload: ResumeParsePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == current_user.id).first()
    if not profile:
        profile = JobSeekerProfile(user_id=current_user.id)
        db.add(profile)
        
    ai_service = get_ai_service()
    parsed_data = ai_service.parse_resume(payload.resume_text)
    
    profile.resume_text = payload.resume_text
    profile.skills = parsed_data.get("skills", [])
    profile.work_history = parsed_data.get("work_history", [])
    profile.education = parsed_data.get("education", [])
    profile.career_goals = parsed_data.get("career_goals", "")
    
    # Run a default career insight analysis
    target_role = "Senior Full-Stack Engineer"
    target_skills = ["FastAPI", "React", "TypeScript", "Docker", "Kubernetes", "AWS", "SQL", "Redis"]
    insights = ai_service.analyze_career_gaps(profile.skills, target_role, target_skills)
    profile.career_insights = {
        "target_role": target_role,
        "target_skills": target_skills,
        "gaps": insights.get("gaps", []),
        "recommendations": insights.get("recommendations", []),
        "suggested_actions": insights.get("suggested_actions", [])
    }
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/me/gap-analysis", response_model=ProfileOut)
def run_gap_analysis(
    payload: GapAnalysisPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Parse resume first.")
        
    ai_service = get_ai_service()
    insights = ai_service.analyze_career_gaps(profile.skills, payload.target_role, payload.target_skills)
    
    profile.career_insights = {
        "target_role": payload.target_role,
        "target_skills": payload.target_skills,
        "gaps": insights.get("gaps", []),
        "recommendations": insights.get("recommendations", []),
        "suggested_actions": insights.get("suggested_actions", [])
    }
    
    db.commit()
    db.refresh(profile)
    return profile
