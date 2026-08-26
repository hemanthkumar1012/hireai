<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status, Query
=======
from fastapi import APIRouter, Depends, HTTPException, Query, status
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import math
from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.saved_job import SavedJob
<<<<<<< HEAD
from app.schemas.job import JobCreate, JobUpdate, JobOut, PaginatedJobs
=======
from app.schemas.job import JobCreate, JobUpdate, JobOut, JobStatus
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
from app.api import deps

router = APIRouter()


@router.get("/", response_model=PaginatedJobs)
def search_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
<<<<<<< HEAD
    work_mode: Optional[str] = None,
    employment_type: Optional[str] = None,
    experience_min: Optional[int] = None,
    experience_max: Optional[int] = None,
    salary_min: Optional[int] = None,
    salary_max: Optional[int] = None,
    company: Optional[str] = None,
    skills: Optional[str] = None,  # comma-separated
    sort: Optional[str] = "newest",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.status == "PUBLISHED", Job.is_active == True)

=======
    skill: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.is_active.is_(True), Job.status == "PUBLISHED")
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    if search:
        query = query.filter(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.company_name.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
            )
        )
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
<<<<<<< HEAD
    if work_mode:
        query = query.filter(Job.work_mode == work_mode.upper())
    if employment_type:
        query = query.filter(Job.employment_type == employment_type.upper())
    if experience_min is not None:
        query = query.filter(Job.experience_min >= experience_min)
    if experience_max is not None:
        query = query.filter(Job.experience_max <= experience_max)
    if salary_min is not None:
        query = query.filter(Job.max_salary >= salary_min)
    if salary_max is not None:
        query = query.filter(Job.min_salary <= salary_max)
    if company:
        query = query.filter(Job.company_name.ilike(f"%{company}%"))
    if skills:
        for skill in skills.split(","):
            skill = skill.strip()
            if skill:
                query = query.filter(Job.skills_needed.contains(skill))

    # Total count before pagination
    total = query.count()

    # Sorting
    if sort == "oldest":
        query = query.order_by(Job.created_at.asc())
    elif sort == "salary_desc":
        query = query.order_by(Job.max_salary.desc().nullslast())
    elif sort == "salary_asc":
        query = query.order_by(Job.min_salary.asc().nullslast())
    else:  # newest
        query = query.order_by(Job.created_at.desc())

    # Pagination
    offset = (page - 1) * page_size
    jobs = query.offset(offset).limit(page_size).all()

    return PaginatedJobs(
        jobs=jobs,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0
    )


@router.get("/recruiter", response_model=List[JobOut])
def list_recruiter_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).order_by(Job.updated_at.desc()).all()
    return jobs

=======
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
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a

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
        company_id=job_in.company_id,
        title=job_in.title,
        description=job_in.description,
        company_name=job_in.company_name,
        location=job_in.location,
        work_mode=job_in.work_mode,
        employment_type=job_in.employment_type,
        min_salary=job_in.min_salary,
        max_salary=job_in.max_salary,
        currency=job_in.currency,
        salary_range=job_in.salary_range,
        experience_min=job_in.experience_min,
        experience_max=job_in.experience_max,
        skills_needed=job_in.skills_needed,
        requirements=job_in.requirements,
        status=job_in.status,
        is_active=(job_in.status == "PUBLISHED"),
        application_deadline=job_in.application_deadline,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


<<<<<<< HEAD
=======
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

>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this job")

    update_data = job_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(job, field, val)
    # Sync is_active with status
    if "status" in update_data:
        job.is_active = (job.status == "PUBLISHED")

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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this job")

    db.delete(job)
    db.commit()
    return None


@router.post("/{job_id}/publish", response_model=JobOut)
def publish_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    job.status = "PUBLISHED"
    job.is_active = True
    db.commit()
    db.refresh(job)
    return job


@router.post("/{job_id}/close", response_model=JobOut)
def close_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    job.status = "CLOSED"
    job.is_active = False
    db.commit()
    db.refresh(job)
    return job


# -------- Saved Jobs --------

@router.post("/{job_id}/save", status_code=status.HTTP_201_CREATED)
def save_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id, SavedJob.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    saved = SavedJob(user_id=current_user.id, job_id=job_id)
    db.add(saved)
    db.commit()
    return {"detail": "Job saved"}


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
def unsave_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    saved = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id, SavedJob.job_id == job_id
    ).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved job not found")
    db.delete(saved)
    db.commit()
    return None
