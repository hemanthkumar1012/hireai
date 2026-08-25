from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    resume_text = Column(Text, nullable=True)
    skills = Column(JSON, default=list, nullable=False)        # List of extracted skills
    work_history = Column(JSON, default=list, nullable=False)  # List of experience dicts
    education = Column(JSON, default=list, nullable=False)     # List of education dicts
    career_goals = Column(Text, nullable=True)
    career_insights = Column(JSON, default=dict, nullable=False) # AI insights (career gaps, target positions, etc.)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
