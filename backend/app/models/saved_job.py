<<<<<<< HEAD
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
=======
from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import relationship

>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
from app.core.database import Base


class SavedJob(Base):
    __tablename__ = "saved_jobs"
<<<<<<< HEAD
    __table_args__ = (
        UniqueConstraint("user_id", "job_id", name="uq_saved_job"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", backref="saved_jobs")
    job = relationship("Job", backref="saved_by")
=======
    __table_args__ = (UniqueConstraint("job_id", "seeker_id", name="uq_saved_job_seeker"),)

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    seeker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    job = relationship("Job", back_populates="saved_by")
    seeker = relationship("User", back_populates="saved_jobs")
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
