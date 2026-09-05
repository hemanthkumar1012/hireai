import json
import logging
from typing import Any, Dict, List, Optional

from google import genai
from google.genai import types

from app.ai.mock import MockAIService
from app.ai.service import AIService


logger = logging.getLogger(__name__)


class GeminiAIService(AIService):

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = "gemini-2.5-flash"
        self.mock_fallback = MockAIService()

    def _generate_json(self, prompt: str, fallback_data: Any) -> Any:
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )

            return json.loads(response.text)

        except Exception as e:
            logger.error(
                f"Gemini API error: {e}. Falling back to mock service."
            )
            return fallback_data

    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        prompt = f"""
You are an expert resume parser.

Extract information from the resume below.

Return ONLY valid JSON using this structure:

{{
    "skills": ["Skill 1", "Skill 2"],
    "work_history": [
        {{
            "company": "Company Name",
            "role": "Role Title",
            "duration": "Duration",
            "description": "Description"
        }}
    ],
    "education": [
        {{
            "school": "School Name",
            "degree": "Degree",
            "field_of_study": "Field",
            "year": "Year"
        }}
    ],
    "career_goals": "Short summary of career goals"
}}

Rules:
- Only extract information that is present in the resume.
- Do not invent companies, skills, education, dates, or achievements.
- If information is missing, use an empty value.
- Keep the extracted information concise.

Resume:
{resume_text}
"""

        fallback = self.mock_fallback.parse_resume(resume_text)
        return self._generate_json(prompt, fallback)

    def analyze_resume(
        self,
        resume_text: str,
        job_description: Optional[str] = None,
    ) -> Dict[str, Any]:
        job_context = ""

        if job_description:
            job_context = f"""
Job Description:

{job_description}
"""

        prompt = f"""
You are an experienced technical recruiter and resume reviewer.

Analyze the candidate's resume and provide practical feedback.

The ATS score is calculated separately by the application.
DO NOT calculate or invent an ATS score.

Return ONLY valid JSON using exactly this structure:

{{
    "summary": "Short overall assessment of the resume.",
    "strengths": [
        "Specific strength found in the resume."
    ],
    "issues": [
        "Specific problem found in the resume."
    ],
    "recommendations": [
        "Specific improvement the candidate should make."
    ],
    "missing_keywords": [
        "Relevant keyword that is missing."
    ],
    "weak_bullets": [
        {{
            "original": "Existing resume bullet.",
            "problem": "Why the bullet is weak.",
            "suggestion": "How to improve the bullet without inventing information."
        }}
    ]
}}

Rules:

1. Only use information actually present in the resume.
2. Never invent achievements, companies, technologies, certifications,
   responsibilities, numbers, or experience.
3. Do not create fake metrics.
4. If a bullet has no measurable result, suggest adding a real metric only
   if the candidate can verify it.
5. Identify vague or weak wording.
6. Identify missing technical or role-specific keywords when a job
   description is provided.
7. Do not recommend adding a skill unless it is relevant to the target role.
8. Keep recommendations practical and specific.
9. Focus on improvements that can realistically increase recruiter and
   ATS readability.
10. Return empty arrays when there is nothing relevant to report.
11. Do not rewrite the entire resume.
12. Do not give an ATS score.

Resume:

{resume_text}

{job_context}
"""

        fallback = self.mock_fallback.analyze_resume(
            resume_text,
            job_description,
        )

        result = self._generate_json(prompt, fallback)

        if not isinstance(result, dict):
            return fallback

        result.setdefault("summary", "")
        result.setdefault("strengths", [])
        result.setdefault("issues", [])
        result.setdefault("recommendations", [])
        result.setdefault("missing_keywords", [])
        result.setdefault("weak_bullets", [])

        return result

    def match_job(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:

        prompt = f"""
You are an expert recruiter matching a candidate's resume to a job.

Evaluate how well the candidate matches the position.

Return ONLY valid JSON using this structure:

{{
    "match_score": 75,
    "match_explanation": {{
        "summary": "Overall fit summary.",
        "matched_skills": ["Skill A", "Skill B"],
        "missing_skills": ["Skill C"],
        "strengths": ["Strength 1"],
        "weaknesses": ["Weakness 1"]
    }}
}}

The match_score must be an integer from 0 to 100.

Do not invent candidate experience or skills.

Candidate Resume:
{resume_text}

Job Title:
{job_title}

Job Description:
{job_description}

Required Job Skills:
{job_skills}
"""

        fallback = self.mock_fallback.match_job(
            resume_text,
            job_title,
            job_description,
            job_skills,
        )

        return self._generate_json(prompt, fallback)

    def analyze_career_gaps(
        self,
        current_skills: List[str],
        target_role: str,
        target_skills: List[str],
    ) -> Dict[str, Any]:

        prompt = f"""
Analyze the career gap for a candidate targeting the role:

{target_role}

Current skills:
{current_skills}

Target skills:
{target_skills}

Return ONLY valid JSON using this structure:

{{
    "gaps": ["Gap 1", "Gap 2"],
    "recommendations": ["Recommendation 1"],
    "suggested_actions": ["Action 1"]
}}

Do not invent skills that the candidate has.

"""

        fallback = self.mock_fallback.analyze_career_gaps(
            current_skills,
            target_role,
            target_skills,
        )

        return self._generate_json(prompt, fallback)

    def generate_interview_questions(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> List[Dict[str, Any]]:

        prompt = f"""
Generate 3 interview questions tailored to this candidate's resume
and the target job.

Return ONLY valid JSON as an array:

[
    {{
        "question": "Question text",
        "type": "technical",
        "expected_answer_points": [
            "Point 1",
            "Point 2"
        ],
        "preparation_tip": "Preparation tip"
    }}
]

The type must be one of:
- technical
- behavioral
- background

Do not invent information about the candidate.

Candidate Resume:
{resume_text}

Job Title:
{job_title}

Job Description:
{job_description}
"""

        fallback = self.mock_fallback.generate_interview_questions(
            resume_text,
            job_title,
            job_description,
        )

        return self._generate_json(prompt, fallback)
