import json
import re
from typing import Any, Dict, List, Optional

from google import genai

from app.ai.mock import MockAIService
from app.ai.service import AIService


class GeminiAIService(AIService):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.mock_fallback = MockAIService()

    def _generate_json(
        self,
        prompt: str,
        fallback: Dict[str, Any],
    ) -> Dict[str, Any]:
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            text = (response.text or "").strip()

            if text.startswith("```"):
                text = re.sub(
                    r"^```(?:json)?\s*|\s*```$",
                    "",
                    text,
                    flags=re.IGNORECASE,
                ).strip()

            result = json.loads(text)

            if not isinstance(result, dict):
                return fallback

            return result

        except Exception:
            return fallback

    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        fallback = self.mock_fallback.parse_resume(resume_text)

        prompt = f"""
Analyze the following resume and return only valid JSON.

Return exactly this structure:
{{
  "skills": [],
  "work_history": [],
  "education": [],
  "career_goals": ""
}}

Rules:
- Extract only information that actually appears in the resume.
- Never invent companies, job titles, dates, degrees, institutions, skills, or achievements.
- Keep work_history and education as arrays of objects.
- If information is missing, use an empty string or empty array.
- Return JSON only.

Resume:
{resume_text}
"""

        result = self._generate_json(prompt, fallback)

        return {
            "skills": result.get("skills", fallback.get("skills", [])),
            "work_history": result.get(
                "work_history",
                fallback.get("work_history", []),
            ),
            "education": result.get(
                "education",
                fallback.get("education", []),
            ),
            "career_goals": result.get(
                "career_goals",
                fallback.get("career_goals", ""),
            ),
        }

    def analyze_resume(
        self,
        resume_text: str,
        job_description: Optional[str] = None,
    ) -> Dict[str, Any]:
        fallback = self.mock_fallback.analyze_resume(
            resume_text,
            job_description,
        )

        job_context = (
            f"""
Job description:
{job_description}
"""
            if job_description
            else ""
        )

        prompt = f"""
Analyze this resume and return only valid JSON.

The numeric ATS score must NOT be calculated by you.
The application calculates the ATS score separately.

Return exactly:
{{
  "summary": "",
  "strengths": [],
  "issues": [],
  "recommendations": [],
  "missing_keywords": [],
  "weak_bullets": [
    {{
      "original": "",
      "problem": "",
      "suggestion": ""
    }}
  ]
}}

Rules:
- Use only facts supported by the resume.
- Never invent skills, companies, education, metrics, achievements, or experience.
- Do not create fake numbers.
- Suggestions must be realistic and clearly identified as suggestions.
- For weak_bullets, use actual weak bullets from the resume when possible.
- If a bullet is already strong, do not rewrite it.
- Missing keywords should only be suggested when they are genuinely relevant to the supplied job description.
- Do not calculate or mention an ATS score.
- Return JSON only.

Resume:
{resume_text}

{job_context}
"""

        result = self._generate_json(prompt, fallback)

        return {
            "summary": result.get(
                "summary",
                fallback.get("summary", ""),
            ),
            "strengths": result.get(
                "strengths",
                fallback.get("strengths", []),
            ),
            "issues": result.get(
                "issues",
                fallback.get("issues", []),
            ),
            "recommendations": result.get(
                "recommendations",
                fallback.get("recommendations", []),
            ),
            "missing_keywords": result.get(
                "missing_keywords",
                fallback.get("missing_keywords", []),
            ),
            "weak_bullets": result.get(
                "weak_bullets",
                fallback.get("weak_bullets", []),
            ),
        }

    def match_job(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:
        fallback = self.mock_fallback.match_job(
            resume_text,
            job_title,
            job_description,
            job_skills,
        )

        prompt = f"""
Evaluate how well the resume matches the job.

Return only valid JSON:
{{
  "match_score": 0,
  "match_explanation": {{
    "summary": "",
    "matched_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": []
  }}
}}

Rules:
- Use only facts supported by the resume and job description.
- match_score must be an integer from 0 to 100.
- Do not invent candidate experience.
- Return JSON only.

Job title:
{job_title}

Job description:
{job_description}

Required job skills:
{json.dumps(job_skills)}

Resume:
{resume_text}
"""

        result = self._generate_json(prompt, fallback)

        explanation = result.get(
            "match_explanation",
            fallback.get("match_explanation", {}),
        )

        if not isinstance(explanation, dict):
            explanation = fallback.get("match_explanation", {})

        score = result.get(
            "match_score",
            fallback.get("match_score", 0),
        )

        try:
            score = int(score)
        except (TypeError, ValueError):
            score = fallback.get("match_score", 0)

        score = max(0, min(100, score))

        return {
            "match_score": score,
            "match_explanation": {
                "summary": explanation.get(
                    "summary",
                    fallback["match_explanation"].get(
                        "summary",
                        "",
                    ),
                ),
                "matched_skills": explanation.get(
                    "matched_skills",
                    fallback["match_explanation"].get(
                        "matched_skills",
                        [],
                    ),
                ),
                "missing_skills": explanation.get(
                    "missing_skills",
                    fallback["match_explanation"].get(
                        "missing_skills",
                        [],
                    ),
                ),
                "strengths": explanation.get(
                    "strengths",
                    fallback["match_explanation"].get(
                        "strengths",
                        [],
                    ),
                ),
                "weaknesses": explanation.get(
                    "weaknesses",
                    fallback["match_explanation"].get(
                        "weaknesses",
                        [],
                    ),
                ),
            },
        }

    def analyze_career_gaps(
        self,
        current_skills: List[str],
        target_role: str,
        target_skills: List[str],
    ) -> Dict[str, Any]:
        fallback = self.mock_fallback.analyze_career_gaps(
            current_skills,
            target_role,
            target_skills,
        )

        prompt = f"""
Identify skill gaps between a candidate's current skills and a target role.

Return only valid JSON:
{{
  "gaps": [],
  "recommendations": [],
  "suggested_actions": []
}}

Do not invent current skills.

Current skills:
{json.dumps(current_skills)}

Target role:
{target_role}

Target skills:
{json.dumps(target_skills)}
"""

        result = self._generate_json(prompt, fallback)

        return {
            "gaps": result.get(
                "gaps",
                fallback.get("gaps", []),
            ),
            "recommendations": result.get(
                "recommendations",
                fallback.get("recommendations", []),
            ),
            "suggested_actions": result.get(
                "suggested_actions",
                fallback.get("suggested_actions", []),
            ),
        }

    def generate_interview_questions(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> List[Dict[str, Any]]:
        fallback = self.mock_fallback.generate_interview_questions(
            resume_text,
            job_title,
            job_description,
        )

        prompt = f"""
Generate interview questions based on the candidate's actual resume
and the supplied job.

Return only valid JSON:
[
  {{
    "question": "",
    "type": "",
    "expected_answer_points": [],
    "preparation_tip": ""
  }}
]

Rules:
- Ask questions relevant to the actual resume.
- Do not invent experience or projects.
- Return 5 questions maximum.
- Return JSON only.

Job title:
{job_title}

Job description:
{job_description}

Resume:
{resume_text}
"""

        result = self._generate_json(
            prompt,
            {"questions": fallback},
        )

        questions = result.get("questions", result)

        if not isinstance(questions, list):
            return fallback

        return questions[:5]
