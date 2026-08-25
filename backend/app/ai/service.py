from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIService(ABC):
    @abstractmethod
    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Parses resume text to extract skills, work history, education, and career goals.
        Returns:
            Dict: {
                "skills": List[str],
                "work_history": List[Dict[str, Any]],
                "education": List[Dict[str, Any]],
                "career_goals": str
            }
        """
        pass

    @abstractmethod
    def match_job(self, resume_text: str, job_title: str, job_description: str, job_skills: List[str]) -> Dict[str, Any]:
        """
        Matches a resume against a job description.
        Returns:
            Dict: {
                "match_score": int (0-100),
                "match_explanation": {
                    "summary": str,
                    "matched_skills": List[str],
                    "missing_skills": List[str],
                    "strengths": List[str],
                    "weaknesses": List[str]
                }
            }
        """
        pass

    @abstractmethod
    def analyze_career_gaps(self, current_skills: List[str], target_role: str, target_skills: List[str]) -> Dict[str, Any]:
        """
        Analyzes the gaps between current skills and a target job role.
        Returns:
            Dict: {
                "gaps": List[str],
                "recommendations": List[str],
                "suggested_actions": List[str]
            }
        """
        pass

    @abstractmethod
    def generate_interview_questions(self, resume_text: str, job_title: str, job_description: str) -> List[Dict[str, Any]]:
        """
        Generates tailored interview questions based on the candidate's resume and target job.
        Returns:
            List[Dict]: [
                {
                    "question": str,
                    "type": str ("technical" | "behavioral" | "background"),
                    "expected_answer_points": List[str],
                    "preparation_tip": str
                }
            ]
        """
        pass
