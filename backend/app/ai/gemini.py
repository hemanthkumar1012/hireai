import re
from typing import Any, Dict, List, Optional

from app.ai.service import AIService


class MockAIService(AIService):

    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        text = resume_text.lower()

        skills = [
            "python",
            "fastapi",
            "django",
            "flask",
            "react",
            "typescript",
            "javascript",
            "html",
            "css",
            "tailwind",
            "next.js",
            "node.js",
            "express",
            "sql",
            "postgresql",
            "mysql",
            "mongodb",
            "redis",
            "docker",
            "kubernetes",
            "aws",
            "gcp",
            "azure",
            "git",
            "ci/cd",
            "celery",
            "graphql",
            "rest api",
            "pytorch",
            "tensorflow",
            "agile",
        ]

        extracted_skills = []

        for skill in skills:
            pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"

            if re.search(pattern, text):
                extracted_skills.append(
                    skill.upper() if len(skill) <= 3 else skill.title()
                )

        work_history = []

        if "react" in text or "typescript" in text:
            work_history.append(
                {
                    "company": "Not specified",
                    "role": "Frontend Developer",
                    "duration": "Not specified",
                    "description": "Experience with React and TypeScript.",
                }
            )

        if "python" in text or "fastapi" in text or "django" in text:
            work_history.append(
                {
                    "company": "Not specified",
                    "role": "Backend Developer",
                    "duration": "Not specified",
                    "description": "Experience with Python-based backend development.",
                }
            )

        education = []

        career_goals = ""

        return {
            "skills": extracted_skills,
            "work_history": work_history,
            "education": education,
            "career_goals": career_goals,
        }

    def analyze_resume(
        self,
        resume_text: str,
        job_description: Optional[str] = None,
    ) -> Dict[str, Any]:

        text = resume_text.lower()

        strengths = []
        issues = []
        recommendations = []
        missing_keywords = []
        weak_bullets = []

        if re.search(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b", resume_text):
            strengths.append("The resume includes an email address.")
        else:
            issues.append("No email address was detected.")

        if re.search(r"\b(?:20\d{2})\b", resume_text):
            strengths.append("The resume contains date information.")
        else:
            issues.append("Work or education dates were not clearly detected.")

        if any(word in text for word in [
            "experience",
            "work experience",
            "professional experience",
        ]):
            strengths.append("A work experience section is present.")
        else:
            issues.append("A clear work experience section is missing.")
            recommendations.append(
                "Add a clearly labeled Work Experience section."
            )

        if "skills" in text or "technical skills" in text:
            strengths.append("A skills section is present.")
        else:
            issues.append("A dedicated skills section was not detected.")
            recommendations.append(
                "Add a Technical Skills section with the technologies you actually use."
            )

        if "education" in text:
            strengths.append("An education section is present.")
        else:
            issues.append("An education section was not detected.")
            recommendations.append(
                "Add your degree, institution, field of study, and graduation year."
            )

        if job_description:
            resume_words = set(re.findall(r"[a-zA-Z0-9+#./-]+", text))
            job_words = set(
                re.findall(
                    r"[a-zA-Z0-9+#./-]+",
                    job_description.lower(),
                )
            )

            important_words = {
                word
                for word in job_words
                if len(word) >= 3
            }

            missing_keywords = sorted(
                word
                for word in important_words
                if word not in resume_words
            )[:20]

        weak_phrases = [
            "responsible for",
            "worked on",
            "helped with",
            "duties included",
            "worked with",
        ]

        for phrase in weak_phrases:
            if phrase in text:
                weak_bullets.append(
                    {
                        "original": phrase,
                        "problem": "The wording is generic and does not clearly show ownership or results.",
                        "suggestion": "Start the bullet with a strong action verb and describe the actual result.",
                    }
                )

        if not any(
            word in text
            for word in [
                "%",
                "users",
                "customers",
                "reduced",
                "increased",
                "improved",
                "optimized",
            ]
        ):
            issues.append(
                "Few measurable achievements were detected."
            )

            recommendations.append(
                "Add real metrics to strong achievements when you can verify them."
            )

        if len(extracted_skills := self.parse_resume(resume_text)["skills"]) == 0:
            issues.append(
                "No common technical skills were detected."
            )

            recommendations.append(
                "Add the technical skills that are genuinely relevant to your target roles."
            )

        if job_description and missing_keywords:
            recommendations.append(
                "Review the job description and naturally include relevant missing keywords when they accurately describe your experience."
            )

        recommendations.extend(
            [
                "Use clear section headings and concise bullet points.",
                "Focus experience bullets on what you built, changed, improved, or delivered.",
                "Do not add technologies, achievements, or metrics that you cannot support.",
            ]
        )

        summary = (
            "The resume has been analyzed using the application's fallback "
            "resume review rules. Improve the issues identified above before "
            "applying."
        )

        return {
            "summary": summary,
            "strengths": strengths[:8],
            "issues": issues[:10],
            "recommendations": recommendations[:10],
            "missing_keywords": missing_keywords[:20],
            "weak_bullets": weak_bullets[:8],
        }

    def match_job(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:

        parsed = self.parse_resume(resume_text)

        candidate_skills = [
            skill.lower()
            for skill in parsed["skills"]
        ]

        matched_skills = []
        missing_skills = []

        for skill in job_skills:
            skill_lower = skill.lower()

            if any(
                skill_lower == candidate
                or skill_lower in candidate
                or candidate in skill_lower
                for candidate in candidate_skills
            ):
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        if job_skills:
            skills_score = int(
                len(matched_skills) / len(job_skills) * 80
            )
        else:
            skills_score = 50

        description = job_description.lower()

        context_matches = sum(
            1
            for skill in candidate_skills
            if skill in description
        )

        context_score = min(20, context_matches * 4)

        match_score = min(
            100,
            max(30, skills_score + context_score),
        )

        strengths = []

        if matched_skills:
            strengths.append(
                f"Relevant skills include {', '.join(matched_skills[:3])}."
            )
        else:
            strengths.append(
                "The candidate has a general technical background."
            )

        weaknesses = []

        if missing_skills:
            weaknesses.append(
                f"Missing skills include {', '.join(missing_skills[:3])}."
            )
        else:
            weaknesses.append(
                "No major skill gaps were identified."
            )

        return {
            "match_score": match_score,
            "match_explanation": {
                "summary": (
                    f"The candidate has approximately "
                    f"{match_score}% alignment with the "
                    f"{job_title} position."
                ),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "strengths": strengths,
                "weaknesses": weaknesses,
            },
        }

    def analyze_career_gaps(
        self,
        current_skills: List[str],
        target_role: str,
        target_skills: List[str],
    ) -> Dict[str, Any]:

        current = {
            skill.lower()
            for skill in current_skills
        }

        gaps = [
            skill
            for skill in target_skills
            if skill.lower() not in current
        ]

        recommendations = []

        if gaps:
            recommendations.append(
                f"Build a practical project using {gaps[0]}."
            )

            if len(gaps) > 1:
                recommendations.append(
                    f"Strengthen your knowledge of {gaps[1]} through a project or structured learning."
                )

        else:
            recommendations.append(
                f"Continue building production-level experience relevant to {target_role}."
            )

        suggested_actions = [
            "Build and document a practical project using the target stack.",
            "Contribute to relevant open-source projects.",
        ]

        return {
            "gaps": gaps,
            "recommendations": recommendations,
            "suggested_actions": suggested_actions,
        }

    def generate_interview_questions(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
    ) -> List[Dict[str, Any]]:

        parsed = self.parse_resume(resume_text)
        skills = parsed["skills"]

        main_skill = (
            skills[0]
            if skills
            else "your main technical skill"
        )

        return [
            {
                "question": (
                    f"Can you explain a project where you used "
                    f"{main_skill}?"
                ),
                "type": "technical",
                "expected_answer_points": [
                    "What you built",
                    "Your specific contribution",
                    "Technical decisions",
                    "Result",
                ],
                "preparation_tip": (
                    "Use a real project and explain the technical "
                    "decisions you made."
                ),
            },
            {
                "question": (
                    "Tell me about a difficult technical problem "
                    "you solved."
                ),
                "type": "behavioral",
                "expected_answer_points": [
                    "Problem",
                    "Investigation",
                    "Solution",
                    "Result",
                ],
                "preparation_tip": (
                    "Use the STAR method and focus on your own actions."
                ),
            },
            {
                "question": (
                    f"Why are you interested in the {job_title} role?"
                ),
                "type": "background",
                "expected_answer_points": [
                    "Relevant skills",
                    "Relevant projects",
                    "Career direction",
                ],
                "preparation_tip": (
                    "Connect your actual experience to the job requirements."
                ),
            },
        ]
