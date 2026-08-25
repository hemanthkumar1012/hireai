from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("job_id", "seeker_id", name="uq_application_job_seeker"),)

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    seeker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="applied", nullable=False, index=True)  # "applied", "reviewing", "interviewed", "accepted", "rejected"
    match_score = Column(Integer, default=0, nullable=False)
    match_explanation = Column(JSON, default=dict, nullable=False)  # AI breakdown of fit
    interview_questions = Column(JSON, default=list, nullable=False)  # Interview prep questions/answers
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    job = relationship("Job", back_populates="applications")
    seeker = relationship("User", back_populates="applications")
