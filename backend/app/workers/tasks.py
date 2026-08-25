from app.workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.profile import JobSeekerProfile
from app.models.application import Application
from app.models.job import Job
from app.ai import get_ai_service

@celery_app.task
def parse_resume_task(profile_id: int, resume_text: str):
    db = SessionLocal()
    try:
        profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.id == profile_id).first()
        if not profile:
            return f"Profile {profile_id} not found."
            
        ai_service = get_ai_service()
        parsed_data = ai_service.parse_resume(resume_text)
        
        profile.resume_text = resume_text
        profile.skills = parsed_data.get("skills", [])
        profile.work_history = parsed_data.get("work_history", [])
        profile.education = parsed_data.get("education", [])
        profile.career_goals = parsed_data.get("career_goals", "")
        
        db.commit()
        return f"Successfully parsed profile {profile_id}."
    except Exception as e:
        db.rollback()
        return f"Error parsing resume for profile {profile_id}: {str(e)}"
    finally:
        db.close()

@celery_app.task
def calculate_match_task(application_id: int):
    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            return f"Application {application_id} not found."
            
        job = db.query(Job).filter(Job.id == app.job_id).first()
        profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == app.seeker_id).first()
        
        if not job or not profile:
            return "Job or Seeker profile not found."
            
        ai_service = get_ai_service()
        match_result = ai_service.match_job(
            resume_text=profile.resume_text or "",
            job_title=job.title,
            job_description=job.description,
            job_skills=job.skills_needed
        )
        
        app.match_score = match_result.get("match_score", 0)
        app.match_explanation = match_result.get("match_explanation", {})
        
        db.commit()
        return f"Successfully computed match for application {application_id}."
    except Exception as e:
        db.rollback()
        return f"Error matching application {application_id}: {str(e)}"
    finally:
        db.close()
