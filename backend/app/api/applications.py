from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.profile import JobSeekerProfile
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.api import deps
from app.ai import get_ai_service

router = APIRouter()

@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    # Check if job exists
    job = db.query(Job).filter(
        Job.id == app_in.job_id,
        Job.is_active.is_(True),
        Job.status == "PUBLISHED",
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found or inactive")
        
    # Check if already applied
    existing_app = db.query(Application).filter(
        Application.job_id == app_in.job_id,
        Application.seeker_id == current_user.id
    ).first()
    if existing_app:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this position"
        )
        
    # Get seeker profile for AI match
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == current_user.id).first()
    resume_text = profile.resume_text if (profile and profile.resume_text) else ""
    
    # Run AI evaluation
    ai_service = get_ai_service()
    match_result = ai_service.match_job(
        resume_text=resume_text,
        job_title=job.title,
        job_description=job.description,
        job_skills=job.skills_needed
    )
    
    interview_qs = ai_service.generate_interview_questions(
        resume_text=resume_text,
        job_title=job.title,
        job_description=job.description
    )
    
    db_app = Application(
        job_id=app_in.job_id,
        seeker_id=current_user.id,
        status="applied",
        match_score=match_result.get("match_score", 0),
        match_explanation=match_result.get("match_explanation", {}),
        interview_questions=interview_qs
    )
    
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/seeker", response_model=List[ApplicationOut])
def get_seeker_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    return db.query(Application)\
        .options(joinedload(Application.job))\
        .filter(Application.seeker_id == current_user.id)\
        .order_by(Application.created_at.desc())\
        .all()

@router.get("/recruiter", response_model=List[ApplicationOut])
def get_recruiter_applications(
    job_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    query = db.query(Application)\
        .options(joinedload(Application.job), joinedload(Application.seeker))\
        .join(Job)\
        .filter(Job.recruiter_id == current_user.id)
        
    if job_id:
        query = query.filter(Application.job_id == job_id)
        
    return query.order_by(Application.match_score.desc()).all()

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    app = db.query(Application)\
        .options(joinedload(Application.job), joinedload(Application.seeker))\
        .filter(Application.id == application_id).first()
        
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Permission check: seeker owner or recruiter owner
    if current_user.role == "JOB_SEEKER" and app.seeker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden access")
    elif current_user.role == "RECRUITER" and app.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden access")
        
    return app

@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    status_in: str,  # e.g., "reviewing", "interviewed", "accepted", "rejected"
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Check if this recruiter owns the job
    job = db.query(Job).filter(Job.id == app.job_id).first()
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden access to this candidate's application")
        
    valid_statuses = ["applied", "reviewing", "interviewed", "accepted", "rejected"]
    if status_in not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    app.status = status_in
    db.commit()
    db.refresh(app)
    return app
