from sqlalchemy import Table, Column, Integer, String, ForeignKey
from app.core.database import Base

job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
    Column("required_level", String, nullable=True),
)
