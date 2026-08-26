from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, func, Index
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.job_skill import job_skills


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
<<<<<<< HEAD
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
=======
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    title = Column(String, nullable=False, index=True)
    slug = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=False)
<<<<<<< HEAD
    company_name = Column(String, nullable=False)  # Denormalized for quick display
    location = Column(String, nullable=False, index=True)
    work_mode = Column(String, default="ONSITE", nullable=False, index=True)  # ONSITE, REMOTE, HYBRID
    employment_type = Column(String, default="FULL_TIME", nullable=False, index=True)  # FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    currency = Column(String, default="USD", nullable=True)
    salary_range = Column(String, nullable=True)  # Legacy display string
    experience_min = Column(Integer, nullable=True)
    experience_max = Column(Integer, nullable=True)
    skills_needed = Column(JSON, default=list, nullable=False)
    requirements = Column(JSON, default=list, nullable=False)
    status = Column(String, default="PUBLISHED", nullable=False, index=True)  # DRAFT, PUBLISHED, CLOSED, ARCHIVED
    is_active = Column(Boolean, default=True, nullable=False)  # Legacy compat — True when status=PUBLISHED
    application_deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False, index=True)
=======
    company_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    salary_range = Column(String, nullable=True)
    skills_needed = Column(JSON, default=list, nullable=False)  # List of string skills
    requirements = Column(JSON, default=list, nullable=False)    # List of requirements
    is_active = Column(Boolean, default=True, nullable=False)
    status = Column(String(20), default="PUBLISHED", nullable=False, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    recruiter = relationship("User", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
<<<<<<< HEAD
    skill_tags = relationship("Skill", secondary=job_skills, backref="jobs")
=======
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
