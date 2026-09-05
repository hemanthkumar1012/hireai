from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.profile import JobSeekerProfile
from app.schemas.profile import ProfileUpdate, ProfileOut
from app.api import deps
from app.ai import get_ai_service
from app.ai.ats_scorer import calculate_ats_score
from app.services.resume_parser import extract_resume_text


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
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == current_user.id
    ).first()

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
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = JobSeekerProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile


@router.post("/me/parse-resume", response_model=ProfileOut)
def parse_my_resume(
    payload: ResumeParsePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == current_user.id
    ).first()

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

    target_role = "Senior Full-Stack Engineer"
    target_skills = [
        "FastAPI",
        "React",
        "TypeScript",
        "Docker",
        "Kubernetes",
        "AWS",
        "SQL",
        "Redis",
    ]

    insights = ai_service.analyze_career_gaps(
        profile.skills,
        target_role,
        target_skills,
    )

    profile.career_insights = {
        "target_role": target_role,
        "target_skills": target_skills,
        "gaps": insights.get("gaps", []),
        "recommendations": insights.get("recommendations", []),
        "suggested_actions": insights.get("suggested_actions", []),
    }

    db.commit()
    db.refresh(profile)

    return profile


@router.post("/me/analyze-resume")
async def analyze_my_resume(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker),
):
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = JobSeekerProfile(user_id=current_user.id)
        db.add(profile)
        db.flush()

    resume_text = await extract_resume_text(file)

    job_description = job_description.strip() or None

    ats_result = calculate_ats_score(
        resume_text,
        job_description,
    )

    ai_service = get_ai_service()

    ai_result = ai_service.analyze_resume(
        resume_text,
        job_description,
    )

    analysis = {
        "ats_score": ats_result.get("ats_score", 0),
        "score_label": ats_result.get("score_label", ""),
        "category_scores": ats_result.get("category_scores", {}),
        "matched_keywords": ats_result.get("matched_keywords", []),
        "missing_keywords": ats_result.get("missing_keywords", []),
        "detected_sections": ats_result.get("detected_sections", []),
        "issues": ats_result.get("issues", []),
        "recommendations": ats_result.get("recommendations", []),
        "strengths": ai_result.get("strengths", []),
        "summary": ai_result.get("summary", ""),
        "weak_bullets": ai_result.get("weak_bullets", []),
    }

    profile.resume_text = resume_text
    profile.resume_analysis = analysis

    db.commit()
    db.refresh(profile)

    return {
        "filename": file.filename,
        "analysis": analysis,
    }


@router.post("/me/gap-analysis", response_model=ProfileOut)
def run_gap_analysis(
    payload: GapAnalysisPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found. Parse resume first.",
        )

    ai_service = get_ai_service()

    insights = ai_service.analyze_career_gaps(
        profile.skills,
        payload.target_role,
        payload.target_skills,
    )

    profile.career_insights = {
        "target_role": payload.target_role,
        "target_skills": payload.target_skills,
        "gaps": insights.get("gaps", []),
        "recommendations": insights.get("recommendations", []),
        "suggested_actions": insights.get("suggested_actions", []),
    }

    db.commit()
    db.refresh(profile)

    return profile
