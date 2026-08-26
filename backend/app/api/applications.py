from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.saved_job import SavedJob
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationUpdate
from app.schemas.job import JobOut
from app.api import deps
from app.ai import get_ai_service

router = APIRouter()

VALID_STATUSES = {"APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW", "OFFER", "HIRED", "REJECTED", "WITHDRAWN"}


# -------- Seeker endpoints --------

@router.post("/", response_model=ApplicationOut)
def apply_to_job(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
<<<<<<< HEAD
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
=======
    # Check if job exists
    job = db.query(Job).filter(
        Job.id == app_in.job_id,
        Job.is_active.is_(True),
        Job.status == "PUBLISHED",
    ).first()
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != "PUBLISHED" or not job.is_active:
        raise HTTPException(status_code=400, detail="This job is not accepting applications")
    if job.recruiter_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot apply to your own job")

    existing = db.query(Application).filter(
        Application.job_id == app_in.job_id,
        Application.seeker_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    # AI matching
    ai_service = get_ai_service()
    profile = current_user.profile
    resume_text = profile.resume_text if profile else ""
    match_data = ai_service.match_job(
        resume_text or "",
        job.title,
        job.description,
        job.skills_needed
    )

    application = Application(
        job_id=app_in.job_id,
        seeker_id=current_user.id,
        cover_letter=app_in.cover_letter,
        status="APPLIED",
        match_score=match_data.get("match_score", 0),
        match_explanation=match_data.get("match_explanation", {}),
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/seeker", response_model=List[ApplicationOut])
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    apps = (
        db.query(Application)
        .options(joinedload(Application.job))
        .filter(Application.seeker_id == current_user.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return apps


@router.post("/{application_id}/withdraw", response_model=ApplicationOut)
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_seeker)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.seeker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your application")
    app.status = "WITHDRAWN"
    db.commit()
    db.refresh(app)
    return app


# -------- Saved Jobs --------

@router.get("/saved-jobs", response_model=List[JobOut])
def list_saved_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    saved = (
        db.query(SavedJob)
        .options(joinedload(SavedJob.job))
        .filter(SavedJob.user_id == current_user.id)
        .order_by(SavedJob.created_at.desc())
        .all()
    )
    return [s.job for s in saved if s.job]


# -------- Recruiter endpoints --------

@router.get("/recruiter", response_model=List[ApplicationOut])
def list_recruiter_applications(
    job_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    query = (
        db.query(Application)
        .options(joinedload(Application.job), joinedload(Application.seeker))
        .join(Job)
        .filter(Job.recruiter_id == current_user.id)
    )
    if job_id:
        query = query.filter(Application.job_id == job_id)
    return query.order_by(Application.match_score.desc()).all()


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    new_status: str = Query(..., alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    if new_status.upper() not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    app = (
        db.query(Application)
        .options(joinedload(Application.job), joinedload(Application.seeker))
        .filter(Application.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this application")

    app.status = new_status.upper()
    db.commit()
    db.refresh(app)
    return app


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    app = (
        db.query(Application)
        .options(joinedload(Application.job), joinedload(Application.seeker))
        .filter(Application.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == "JOB_SEEKER" and app.seeker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    elif current_user.role == "RECRUITER" and app.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return app
