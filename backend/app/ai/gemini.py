import json
import logging
from google import genai
from google.genai import types
from typing import List, Dict, Any
from app.ai.service import AIService
from app.ai.mock import MockAIService

logger = logging.getLogger(__name__)

class GeminiAIService(AIService):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = 'gemini-2.5-flash'
        self.mock_fallback = MockAIService()

    def _generate_json(self, prompt: str, fallback_data: Any) -> Any:
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini API error: {e}. Falling back to mock service.")
            return fallback_data

    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        prompt = f"""
        You are an expert AI resume parser. Extract skills, work history, education, and career goals from the following resume.
        Return the result EXACTLY as a JSON object with this schema:
        {{
            "skills": ["Skill1", "Skill2", ...],
            "work_history": [
                {{"company": "Company Name", "role": "Role Title", "duration": "Years/Months", "description": "Bullet points or description"}}
            ],
            "education": [
                {{"school": "School Name", "degree": "Degree", "field_of_study": "Field", "year": "Year"}}
            ],
            "career_goals": "Short summary of candidate's career goals"
        }}
        
        Resume text:
        {resume_text}
        """
        fallback = self.mock_fallback.parse_resume(resume_text)
        return self._generate_json(prompt, fallback)

    def match_job(self, resume_text: str, job_title: str, job_description: str, job_skills: List[str]) -> Dict[str, Any]:
        prompt = f"""
        You are an expert recruiter matching a candidate's resume to a job description.
        Evaluate the fit.
        Return the result EXACTLY as a JSON object with this schema:
        {{
            "match_score": 75, // Integer 0 to 100
            "match_explanation": {{
                "summary": "Overall fit summary...",
                "matched_skills": ["SkillA", "SkillB", ...],
                "missing_skills": ["SkillC", "SkillD", ...],
                "strengths": ["Strength1", ...],
                "weaknesses": ["Weakness1", ...]
            }}
        }}

        Candidate Resume:
        {resume_text}

        Job Title: {job_title}
        Job Description: {job_description}
        Job Skills Required: {job_skills}
        """
        fallback = self.mock_fallback.match_job(resume_text, job_title, job_description, job_skills)
        return self._generate_json(prompt, fallback)

    def analyze_career_gaps(self, current_skills: List[str], target_role: str, target_skills: List[str]) -> Dict[str, Any]:
        prompt = f"""
        Analyze the career gap for a candidate wanting to transition to the role: "{target_role}".
        Candidate's current skills: {current_skills}
        Target role skills: {target_skills}
        
        Return the result EXACTLY as a JSON object with this schema:
        {{
            "gaps": ["Gap1", "Gap2", ...],
            "recommendations": ["Recommendation1", ...],
            "suggested_actions": ["Action1", ...]
        }}
        """
        fallback = self.mock_fallback.analyze_career_gaps(current_skills, target_role, target_skills)
        return self._generate_json(prompt, fallback)

    def generate_interview_questions(self, resume_text: str, job_title: str, job_description: str) -> List[Dict[str, Any]]:
        prompt = f"""
        Generate a list of 3 tailored interview questions for a candidate with the following resume applying for the role "{job_title}".
        Return the result EXACTLY as a JSON array of objects with this schema:
        [
            {{
                "question": "Question text...",
                "type": "technical" or "behavioral" or "background",
                "expected_answer_points": ["Point1", "Point2", ...],
                "preparation_tip": "Tip..."
            }}
        ]
        
        Candidate Resume:
        {resume_text}
        
        Job Title: {job_title}
        Job Description: {job_description}
        """
        fallback = self.mock_fallback.generate_interview_questions(resume_text, job_title, job_description)
        return self._generate_json(prompt, fallback)
