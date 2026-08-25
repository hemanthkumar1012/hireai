from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    seeker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="applied", nullable=False)  # "applied", "reviewing", "interviewed", "accepted", "rejected"
    match_score = Column(Integer, default=0, nullable=False)
    match_explanation = Column(JSON, default=dict, nullable=False)  # AI breakdown of fit
    interview_questions = Column(JSON, default=list, nullable=False)  # Interview prep questions/answers
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    job = relationship("Job", back_populates="applications")
    seeker = relationship("User", back_populates="applications")
