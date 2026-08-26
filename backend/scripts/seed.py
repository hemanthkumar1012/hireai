import os
import sys
from datetime import datetime, timedelta

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.profile import JobSeekerProfile
from app.models.recruiter_profile import RecruiterProfile
from app.models.company import Company
from app.models.job import Job
from app.core.security import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    if db.query(User).count() > 0:
        print("Database already contains data. Skipping seed.")
        return

    print("Creating demo users...")
    
    # 1. Admin
    admin = User(
        email="admin@applyright.com",
        password_hash=get_password_hash("admin123"),
        first_name="System",
        last_name="Admin",
        role="ADMIN"
    )
    db.add(admin)

    # 2. Recruiter
    recruiter = User(
        email="recruiter@techcorp.com",
        password_hash=get_password_hash("recruiter123"),
        first_name="Sarah",
        last_name="Jenkins",
        role="RECRUITER"
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    # 3. Company
    company = Company(
        name="TechCorp Solutions",
        slug="techcorp-solutions",
        website="https://techcorp.example.com",
        industry="Enterprise Software",
        description="We build scalable cloud solutions for modern enterprises.",
        location="San Francisco, CA",
        company_size="51-200",
        founded_year=2015
    )
    db.add(company)
    db.commit()
    db.refresh(company)

    # Link Recruiter to Company
    rec_profile = RecruiterProfile(
        user_id=recruiter.id,
        company_id=company.id,
        designation="Senior Technical Recruiter"
    )
    db.add(rec_profile)

    # 4. Job Seeker
    seeker = User(
        email="seeker@example.com",
        password_hash=get_password_hash("seeker123"),
        first_name="Alex",
        last_name="Chen",
        role="JOB_SEEKER"
    )
    db.add(seeker)
    db.commit()
    db.refresh(seeker)
    
    seeker_profile = JobSeekerProfile(
        user_id=seeker.id,
        headline="Full-Stack Engineer",
        bio="Passionate developer with 4 years of experience building React and FastAPI applications.",
        location="Austin, TX",
        years_of_experience=4,
        skills=["Python", "FastAPI", "React", "TypeScript", "PostgreSQL"],
        preferred_work_mode="REMOTE"
    )
    db.add(seeker_profile)

    # 5. Jobs
    jobs = [
        Job(
            recruiter_id=recruiter.id,
            company_id=company.id,
            company_name=company.name,
            title="Senior Backend Engineer",
            description="We are looking for a Senior Backend Engineer to lead our core API development using Python and FastAPI.\n\nYou will be responsible for system architecture, performance optimization, and scaling our infrastructure.",
            location="San Francisco, CA",
            work_mode="HYBRID",
            employment_type="FULL_TIME",
            min_salary=140000,
            max_salary=180000,
            currency="USD",
            salary_range="$140k - $180k",
            experience_min=5,
            experience_max=10,
            skills_needed=["Python", "FastAPI", "PostgreSQL", "AWS", "Docker"],
            requirements=[
                "5+ years of backend development experience",
                "Deep knowledge of Python and modern async frameworks",
                "Experience with containerization and CI/CD",
                "Strong SQL and database design skills"
            ],
            status="PUBLISHED",
            is_active=True,
            application_deadline=datetime.utcnow() + timedelta(days=30)
        ),
        Job(
            recruiter_id=recruiter.id,
            company_id=company.id,
            company_name=company.name,
            title="Frontend React Developer",
            description="Join our frontend team to build highly responsive and accessible user interfaces. You will work closely with design and product teams.",
            location="Remote",
            work_mode="REMOTE",
            employment_type="FULL_TIME",
            min_salary=100000,
            max_salary=130000,
            currency="USD",
            salary_range="$100k - $130k",
            experience_min=2,
            experience_max=5,
            skills_needed=["React", "TypeScript", "Tailwind CSS", "Redux"],
            requirements=[
                "Strong proficiency in JavaScript/TypeScript",
                "Experience with React and modern hooks",
                "Eye for design and UX",
                "Familiarity with REST APIs"
            ],
            status="PUBLISHED",
            is_active=True,
            application_deadline=datetime.utcnow() + timedelta(days=15)
        ),
        Job(
            recruiter_id=recruiter.id,
            company_id=company.id,
            company_name=company.name,
            title="Data Scientist (Draft)",
            description="Looking for a data scientist to analyze user behavior.",
            location="New York, NY",
            work_mode="ONSITE",
            employment_type="FULL_TIME",
            skills_needed=["Python", "Pandas", "Machine Learning"],
            requirements=[],
            status="DRAFT",
            is_active=False
        )
    ]
    
    db.add_all(jobs)
    db.commit()
    
    print("\n[SUCCESS] Seed completed successfully!")
    print("\n--- Demo Accounts ---")
    print("Job Seeker : seeker@example.com / seeker123")
    print("Recruiter  : recruiter@techcorp.com / recruiter123")
    print("Admin      : admin@applyright.com / admin123")

if __name__ == "__main__":
    seed_db()
