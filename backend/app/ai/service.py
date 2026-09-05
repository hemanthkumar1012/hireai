from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class AIService(ABC):

    @abstractmethod
    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Extract structured information from a resume.
        """
        pass

    @abstractmethod
    def analyze_resume(
        self,
        resume_text: str,
        job_description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Analyze the resume and return semantic feedback.

        The numeric ATS score is calculated separately by the
        deterministic ATS scorer.
        """
        pass

    @abstractmethod
    def match_job(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:
        """
        Match a resume against a job description.
        """
        pass

    @abstractmethod
    def analyze_career_gaps(
        self,
        current_skills: List[str],
        target_role: str,
        target_skills: List[str],
    ) -> Dict[str, Any]:
        """
        Analyze the gap between current skills and a target role.
        """
        pass

    @abstractmethod
    def generate_interview_questions(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> List[Dict[str, Any]]:
        """
        Generate interview questions based on the resume and job.
        """
        pass
