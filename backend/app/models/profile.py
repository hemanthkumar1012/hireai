from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Professional info
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    current_company = Column(String, nullable=True)
    current_role = Column(String, nullable=True)
    expected_salary = Column(String, nullable=True)
    preferred_job_type = Column(String, nullable=True)
    preferred_work_mode = Column(String, nullable=True)

    # Links
    portfolio_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)

    # AI data
    resume_text = Column(Text, nullable=True)
    resume_analysis = Column(JSON, nullable=True)
    skills = Column(JSON, default=list, nullable=False)
    work_history = Column(JSON, default=list, nullable=False)
    education = Column(JSON, default=list, nullable=False)
    career_goals = Column(Text, nullable=True)
    career_insights = Column(JSON, default=dict, nullable=False)
    profile_completion = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
