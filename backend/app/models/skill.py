from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    normalized_name = Column(String, nullable=False, unique=True, index=True)
