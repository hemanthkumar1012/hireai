<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, UniqueConstraint, func
=======
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, UniqueConstraint, func
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
from sqlalchemy.orm import relationship
from app.core.database import Base


class Application(Base):
    __tablename__ = "applications"
<<<<<<< HEAD
    __table_args__ = (
        UniqueConstraint("job_id", "seeker_id", name="uq_application_job_seeker"),
    )
=======
    __table_args__ = (UniqueConstraint("job_id", "seeker_id", name="uq_application_job_seeker"),)
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    seeker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
<<<<<<< HEAD
    cover_letter = Column(Text, nullable=True)
    status = Column(String, default="APPLIED", nullable=False, index=True)
    # Statuses: APPLIED, SCREENING, SHORTLISTED, INTERVIEW, OFFER, HIRED, REJECTED, WITHDRAWN
=======
    status = Column(String, default="applied", nullable=False, index=True)  # "applied", "reviewing", "interviewed", "accepted", "rejected"
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    match_score = Column(Integer, default=0, nullable=False)
    match_explanation = Column(JSON, default=dict, nullable=False)
    interview_questions = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    job = relationship("Job", back_populates="applications")
    seeker = relationship("User", back_populates="applications")
