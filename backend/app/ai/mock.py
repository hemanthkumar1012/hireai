import re
from typing import Any, Dict, List

from app.ai.service import AIService


class MockAIService(AIService):
    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        text = resume_text.lower()

        all_possible_skills = [
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

        for skill in all_possible_skills:
            pattern = r"\b" + re.escape(skill) + r"\b"

            if re.search(pattern, text):
                if len(skill) <= 3:
                    display_skill = skill.upper()
                else:
                    display_skill = skill.title()

                extracted_skills.append(display_skill)

        work_history = []

        if "react" in text or "typescript" in text:
            work_history.append(
                {
                    "company": "Not specified",
                    "role": "Frontend Developer",
                    "duration": "Not specified",
                    "description": "Frontend experience was detected in the resume.",
                }
            )

        if "python" in text or "fastapi" in text or "django" in text:
            work_history.append(
                {
                    "company": "Not specified",
                    "role": "Backend Developer",
                    "duration": "Not specified",
                    "description": "Backend development experience was detected in the resume.",
                }
            )

        education = []

        degree_patterns = [
            r"bachelor(?:'s)?(?: degree)?(?: in)? ([a-zA-Z &]+)",
            r"master(?:'s)?(?: degree)?(?: in)? ([a-zA-Z &]+)",
            r"b\.?tech(?:\.| in)? ([a-zA-Z &]+)",
            r"m\.?tech(?:\.| in)? ([a-zA-Z &]+)",
        ]

        for pattern in degree_patterns:
            match = re.search(pattern, resume_text, re.IGNORECASE)

            if match:
                field = match.group(1).strip(" .,-")

                education.append(
                    {
                        "school": "Not specified",
                        "degree": "Degree",
                        "field_of_study": field,
                        "year": "",
                    }
                )

                break

        career_goals = ""

        if "software engineer" in text or "developer" in text:
            career_goals = "Career interest in software development."

        return {
            "skills": extracted_skills,
            "work_history": work_history,
            "education": education,
            "career_goals": career_goals,
        }

    def analyze_resume(
        self,
        resume_text: str,
        job_description: str | None = None,
    ) -> Dict[str, Any]:
        text = resume_text.strip()

        strengths: List[str] = []
        issues: List[str] = []
        recommendations: List[str] = []
        missing_keywords: List[str] = []
        weak_bullets: List[Dict[str, str]] = []

        sections = {
            "experience": r"\b(experience|work experience|professional experience)\b",
            "education": r"\b(education|academic background)\b",
            "skills": r"\b(skills|technical skills|technologies)\b",
            "projects": r"\b(projects|personal projects|academic projects)\b",
            "summary": r"\b(summary|profile|objective|professional summary)\b",
        }

        detected_sections = [
            name
            for name, pattern in sections.items()
            if re.search(pattern, text, re.IGNORECASE)
        ]

        if "experience" in detected_sections:
            strengths.append("A work experience section is present.")
        else:
            issues.append("A clear experience section was not detected.")
            recommendations.append(
                "Add a clearly labeled Experience section with your most relevant roles."
            )

        if "skills" in detected_sections:
            strengths.append("A dedicated skills section is present.")
        else:
            issues.append("A dedicated skills section was not detected.")
            recommendations.append(
                "Add a dedicated Skills section containing relevant technical and professional skills."
            )

        if "education" in detected_sections:
            strengths.append("Education information is included.")
        else:
            issues.append("An education section was not detected.")
            recommendations.append(
                "Add a clearly labeled Education section with your degree and institution."
            )

        if "projects" in detected_sections:
            strengths.append("Projects are included, which can help demonstrate practical experience.")
        else:
            recommendations.append(
                "Add relevant projects with technologies used and the result or outcome of the work."
            )

        if "summary" in detected_sections:
            strengths.append("A professional summary or profile section is present.")
        else:
            recommendations.append(
                "Consider adding a concise professional summary tailored to the role you are targeting."
            )

        action_words = [
            "built",
            "developed",
            "designed",
            "implemented",
            "created",
            "optimized",
            "automated",
            "improved",
            "led",
            "delivered",
            "managed",
            "engineered",
        ]

        action_word_count = sum(
            len(re.findall(r"\b" + re.escape(word) + r"\b", text, re.IGNORECASE))
            for word in action_words
        )

        if action_word_count >= 3:
            strengths.append("Resume bullets use several action-oriented verbs.")
        else:
            issues.append("Resume bullets contain limited action-oriented language.")
            recommendations.append(
                "Rewrite bullets with strong action verbs that clearly describe what you did."
            )

        metric_pattern = r"\b\d+(?:\.\d+)?\s*(?:%|percent|x|users|customers|clients|ms|seconds?|minutes?|hours?|days?)\b"

        if re.search(metric_pattern, text, re.IGNORECASE):
            strengths.append("Some measurable outcomes or metrics are included.")
        else:
            issues.append("Few or no measurable results were detected.")
            recommendations.append(
                "Add real metrics where available, such as performance improvements, users served, cost savings, or delivery time."
            )

        if job_description:
            job_text = job_description.lower()

            common_keywords = [
                "python",
                "java",
                "javascript",
                "typescript",
                "react",
                "node.js",
                "fastapi",
                "django",
                "sql",
                "postgresql",
                "mongodb",
                "redis",
                "docker",
                "kubernetes",
                "aws",
                "azure",
                "gcp",
                "git",
                "rest api",
                "graphql",
            ]

            resume_lower = text.lower()

            for keyword in common_keywords:
                if keyword in job_text and keyword not in resume_lower:
                    missing_keywords.append(keyword)

            if missing_keywords:
                recommendations.append(
                    "Review the job description and add missing keywords only where they genuinely match your experience."
                )

        bullet_lines = [
            line.strip("•- ").strip()
            for line in text.splitlines()
            if line.strip("•- ").strip()
        ]

        weak_patterns = [
            "worked on",
            "responsible for",
            "helped with",
            "involved in",
            "participated in",
        ]

        for line in bullet_lines:
            line_lower = line.lower()

            for phrase in weak_patterns:
                if phrase in line_lower:
                    weak_bullets.append(
                        {
                            "original": line,
                            "problem": f"The bullet begins with weak phrasing such as '{phrase}'.",
                            "suggestion": "Rewrite it with a specific action, technology, and real outcome.",
                        }
                    )
                    break

            if len(weak_bullets) >= 5:
                break

        if not text:
            return {
                "summary": "No readable resume content was provided.",
                "strengths": [],
                "issues": ["The resume does not contain readable content."],
                "recommendations": [
                    "Upload a readable PDF or DOCX resume with your professional information."
                ],
                "missing_keywords": missing_keywords,
                "weak_bullets": weak_bullets,
            }

        if not issues:
            summary = (
                "The resume contains the main sections and several signals of a "
                "well-structured professional profile."
            )
        else:
            summary = (
                "The resume contains useful information, but several areas can be "
                "improved to make the content clearer and more ATS-friendly."
            )

        return {
            "summary": summary,
            "strengths": strengths,
            "issues": issues,
            "recommendations": recommendations,
            "missing_keywords": missing_keywords,
            "weak_bullets": weak_bullets,
        }

    def match_job(
        self,
        resume_text: str,
        job_title: str,
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:
        parsed = self.parse_resume(resume_text)
        candidate_skills = [skill.lower() for skill in parsed["skills"]]

        matched_skills = []
        missing_skills = []

        for job_skill in job_skills:
            job_skill_clean = job_skill.lower()

            if any(
                candidate_skill == job_skill_clean
                or job_skill_clean in candidate_skill
                or candidate_skill in job_skill_clean
                for candidate_skill in candidate_skills
            ):
                matched_skills.append(job_skill)
            else:
                missing_skills.append(job_skill)

        total_skills = len(job_skills)

        if total_skills > 0:
            skills_score = int(
                (len(matched_skills) / total_skills) * 80
            )
        else:
            skills_score = 50

        description_lower = job_description.lower()

        context_matches = sum(
            1
            for candidate_skill in candidate_skills
            if candidate_skill in description_lower
        )

        context_score = min(20, context_matches * 4)

        match_score = min(
            100,
            max(30, skills_score + context_score),
        )

        strengths = [
            (
                f"Strong foundation in {', '.join(matched_skills[:3])}."
                if matched_skills
                else "General technical literacy."
            )
        ]

        if len(matched_skills) > 3:
            strengths.append(
                "Several resume technologies align with the job requirements."
            )

        weaknesses = []

        if missing_skills:
            weaknesses.append(
                f"Requires upskilling in {', '.join(missing_skills[:3])}."
            )
        else:
            weaknesses.append(
                "No critical technology gaps identified."
            )

        summary = (
            f"The candidate possesses a {match_score}% alignment "
            f"with the {job_title} position. "
        )

        if match_score >= 80:
            summary += (
                "The profile aligns strongly with the core technical requirements."
            )
        elif match_score >= 60:
            summary += (
                "The profile is a reasonable match but has some areas "
                "that could be strengthened."
            )
        else:
            summary += (
                "The candidate meets some base criteria but has "
                "several important skill gaps."
            )

        return {
            "match_score": match_score,
            "match_explanation": {
                "summary": summary,
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
        current_clean = [skill.lower() for skill in current_skills]

        gaps = [
            target_skill
            for target_skill in target_skills
            if target_skill.lower() not in current_clean
        ]

        if not gaps:
            gaps = [
                "System Architecture Design",
                "Cloud Infrastructure",
                "DevOps CI/CD Pipelines",
            ]

        recommendations = [
            f"Complete an advanced project using {gaps[0]}.",
            f"Add {gaps[1] if len(gaps) > 1 else 'high-performance caching'} to a portfolio project and document the implementation.",
        ]

        suggested_actions = [
            "Contribute to open-source repositories using your target technology stack.",
            "Design and document a production-style system architecture on GitHub.",
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

        primary_skill = skills[0] if skills else "REST APIs"

        return [
            {
                "question": (
                    f"Can you describe your experience working with "
                    f"{primary_skill}?"
                ),
                "type": "technical",
                "expected_answer_points": [
                    "Explain a real project where you used the technology.",
                    "Describe your implementation decisions.",
                    "Discuss performance, reliability, or scalability considerations.",
                ],
                "preparation_tip": (
                    "Use a real project and explain the problem, your implementation, "
                    "and the result."
                ),
            },
            {
                "question": (
                    "Tell me about a challenging technical problem you encountered. "
                    "How did you diagnose and solve it?"
                ),
                "type": "behavioral",
                "expected_answer_points": [
                    "Clear description of the problem.",
                    "Structured troubleshooting approach.",
                    "What changed after the fix.",
                ],
                "preparation_tip": (
                    "Use the STAR method and focus on your specific contribution."
                ),
            },
            {
                "question": (
                    f"How does your background prepare you for the "
                    f"{job_title} role?"
                ),
                "type": "background",
                "expected_answer_points": [
                    "Relevant technical experience.",
                    "Relevant projects or responsibilities.",
                    "Connection between your background and the job requirements.",
                ],
                "preparation_tip": (
                    "Connect your real experience directly to the job description."
                ),
            },
        ]
        
