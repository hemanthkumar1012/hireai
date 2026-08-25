from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.saved_job import SavedJob
from app.schemas.job import JobCreate, JobUpdate, JobOut, JobStatus
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[JobOut])
def get_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
    skill: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.is_active.is_(True), Job.status == "PUBLISHED")
    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) |
            (Job.company_name.ilike(f"%{search}%")) |
            (Job.description.ilike(f"%{search}%"))
        )
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if skill:
        query = query.filter(Job.skills_needed.contains([skill]))
    return query.order_by(Job.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()


@router.get("/saved", response_model=List[JobOut])
def get_saved_jobs(db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_seeker)):
    return db.query(Job).join(SavedJob).filter(SavedJob.seeker_id == current_user.id, Job.is_active.is_(True)).order_by(SavedJob.created_at.desc()).all()


@router.post("/{job_id}/save", status_code=status.HTTP_201_CREATED)
def save_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_seeker)):
    job = db.query(Job).filter(Job.id == job_id, Job.is_active.is_(True), Job.status == "PUBLISHED").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found or inactive")
    if db.query(SavedJob).filter_by(job_id=job_id, seeker_id=current_user.id).first():
        raise HTTPException(status_code=409, detail="Job is already saved")
    db.add(SavedJob(job_id=job_id, seeker_id=current_user.id))
    db.commit()
    return {"saved": True, "job_id": job_id}


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
def unsave_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_seeker)):
    saved_job = db.query(SavedJob).filter_by(job_id=job_id, seeker_id=current_user.id).first()
    if not saved_job:
        raise HTTPException(status_code=404, detail="Saved job not found")
    db.delete(saved_job)
    db.commit()

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/", response_model=JobOut)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    job = Job(
        recruiter_id=current_user.id,
        title=job_in.title,
        description=job_in.description,
        company_name=job_in.company_name,
        location=job_in.location,
        salary_range=job_in.salary_range,
        skills_needed=job_in.skills_needed,
        requirements=job_in.requirements
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.post("/{job_id}/lifecycle", response_model=JobOut)
def change_job_lifecycle(
    job_id: int,
    new_status: JobStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
):
    job = db.query(Job).filter(Job.id == job_id, Job.recruiter_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    allowed_transitions = {
        "DRAFT": {"PUBLISHED", "ARCHIVED"},
        "PUBLISHED": {"CLOSED", "ARCHIVED"},
        "CLOSED": {"PUBLISHED", "ARCHIVED"},
        "ARCHIVED": set(),
    }
    if new_status not in allowed_transitions[job.status]:
        raise HTTPException(status_code=400, detail=f"Cannot change job from {job.status} to {new_status}")

    job.status = new_status
    job.is_active = new_status != "ARCHIVED"
    db.commit()
    db.refresh(job)
    return job

@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this job post"
        )
        
    for field, val in job_in.model_dump(exclude_unset=True).items():
        setattr(job, field, val)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this job post"
        )
        
    db.delete(job)
    db.commit()
    return None
