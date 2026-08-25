import re
from typing import List, Dict, Any
from app.ai.service import AIService

class MockAIService(AIService):
    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        text = resume_text.lower()
        
        # Extracted skills by keyword scanning
        all_possible_skills = [
            "python", "fastapi", "django", "flask", "react", "typescript", "javascript",
            "html", "css", "tailwind", "next.js", "node.js", "express", "sql", "postgresql",
            "mysql", "mongodb", "redis", "docker", "kubernetes", "aws", "gcp", "azure",
            "git", "ci/cd", "celery", "graphql", "rest api", "pytorch", "tensorflow", "agile"
        ]
        
        extracted_skills = []
        for skill in all_possible_skills:
            # Match boundary word
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text):
                # Capitalize nicely
                extracted_skills.append(skill.upper() if len(skill) <= 3 else skill.title())
        
        # Fallback to default skills if none detected
        if not extracted_skills:
            extracted_skills = ["Python", "SQL", "Git", "REST APIs", "JavaScript"]

        # Formulate work history based on detected keywords
        work_history = []
        if "react" in text or "typescript" in text:
            work_history.append({
                "company": "PixelCraft Technologies",
                "role": "Frontend Developer",
                "duration": "2023 - Present",
                "description": "Architected complex responsive web apps using React, Tailwind CSS, and TypeScript. Optimized load speed by 35%."
            })
        if "python" in text or "fastapi" in text or "django" in text:
            work_history.append({
                "company": "ByteScale Systems",
                "role": "Software Engineer (Backend)",
                "duration": "2021 - 2023",
                "description": "Designed high-performance REST APIs using Python, Django, and PostgreSQL. Integrated Redis cache to optimize db queries."
            })
        
        # Fallback work history
        if not work_history:
            work_history = [
                {
                    "company": "Alpha Tech Solutions",
                    "role": "Junior Developer",
                    "duration": "2022 - 2024",
                    "description": "Contributed to internal web portals, resolved bugs, and supported backend database migrations."
                }
            ]

        # Education
        education = [
            {
                "school": "Global Tech University",
                "degree": "Bachelor of Science",
                "field_of_study": "Computer Science",
                "year": "2021"
            }
        ]

        # Career goals summary
        career_goals = "Aspiring Senior Full-Stack Engineer looking to leverage AI integrations, containerized architectures, and modern cloud platforms to build highly scalable products."

        return {
            "skills": extracted_skills,
            "work_history": work_history,
            "education": education,
            "career_goals": career_goals
        }

    def match_job(self, resume_text: str, job_title: str, job_description: str, job_skills: List[str]) -> Dict[str, Any]:
        parsed = self.parse_resume(resume_text)
        candidate_skills = [s.lower() for s in parsed["skills"]]
        
        matched_skills = []
        missing_skills = []
        
        for js in job_skills:
            js_clean = js.lower()
            if any(cs == js_clean or js_clean in cs or cs in js_clean for cs in candidate_skills):
                matched_skills.append(js)
            else:
                missing_skills.append(js)

        # Calculate a deterministic score based on match
        total_skills = len(job_skills)
        if total_skills > 0:
            skills_score = int((len(matched_skills) / total_skills) * 80) # weight skills at 80% max
        else:
            skills_score = 50
            
        # Add 20% weight based on context match
        desc_lower = job_description.lower()
        context_matches = sum(1 for cs in candidate_skills if cs in desc_lower)
        context_score = min(20, context_matches * 4)
        
        match_score = min(100, max(30, skills_score + context_score))

        # Summaries
        strengths = [f"Strong foundation in {', '.join(matched_skills[:3])}." if matched_skills else "General technical literacy."]
        if len(matched_skills) > 3:
            strengths.append("Demonstrated professional experience matching core framework dependencies.")
            
        weaknesses = []
        if missing_skills:
            weaknesses.append(f"Requires upskilling in {', '.join(missing_skills[:3])}.")
        else:
            weaknesses.append("No critical technology gaps identified.")

        summary = f"The candidate possesses a {match_score}% alignment with the {job_title} position. "
        if match_score >= 80:
            summary += "Highly qualified profile matching core competencies and project-level credentials."
        elif match_score >= 60:
            summary += "Strong match but would benefit from filling minor skill gaps to fully adapt to company infrastructure."
        else:
            summary += "Candidate meets base criteria but lacks critical framework dependencies needed for immediate project execution."

        return {
            "match_score": match_score,
            "match_explanation": {
                "summary": summary,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "strengths": strengths,
                "weaknesses": weaknesses
            }
        }

    def analyze_career_gaps(self, current_skills: List[str], target_role: str, target_skills: List[str]) -> Dict[str, Any]:
        curr_clean = [s.lower() for s in current_skills]
        gaps = []
        for ts in target_skills:
            if ts.lower() not in curr_clean:
                gaps.append(ts)

        if not gaps:
            gaps = ["System Architecture Design", "Cloud Infrastructure (AWS/GCP)", "DevOps CI/CD Pipelines"]

        recommendations = [
            f"Complete an advanced certification or project using {gaps[0]}.",
            f"Refactor a portfolio application to implement {gaps[1] if len(gaps) > 1 else 'high-performance caching'}."
        ]
        
        suggested_actions = [
            "Contribute to open-source repositories written in your target stack.",
            "Design and document a mock microservices system architecture on GitHub."
        ]

        return {
            "gaps": gaps,
            "recommendations": recommendations,
            "suggested_actions": suggested_actions
        }

    def generate_interview_questions(self, resume_text: str, job_title: str, job_description: str) -> List[Dict[str, Any]]:
        parsed = self.parse_resume(resume_text)
        skills = parsed["skills"]

        questions = [
            {
                "question": f"Can you describe your experience designing backend systems or working with frameworks like {skills[0] if skills else 'REST APIs'}?",
                "type": "technical",
                "expected_answer_points": [
                    "Experience structuring API endpoints",
                    "Database schema design and migration handling",
                    "Performance optimization (indexing, caching)"
                ],
                "preparation_tip": "Focus your answer on a real production project. Explain the architecture, database constraints, and trade-offs you chose."
            },
            {
                "question": "Tell me about a challenging career obstacle or technical bug you encountered. How did you diagnose and resolve it?",
                "type": "behavioral",
                "expected_answer_points": [
                    "Structured troubleshooting methodology (logs, profiling)",
                    "Collaboration with team members if applicable",
                    "Root-cause resolution and future prevention steps"
                ],
                "preparation_tip": "Use the STAR method: Situation, Task, Action, Result. Highlight your analytical mindset and persistency."
            },
            {
                "question": f"Based on your profile, you've worked at companies like {parsed['work_history'][0]['company'] if parsed['work_history'] else 'Alpha Tech'}. How does your background align with our work at this company?",
                "type": "background",
                "expected_answer_points": [
                    "Direct alignment of developer skills",
                    "Familiarity with team workflows and sprint cycles",
                    "Genuine interest in the company's domain/product"
                ],
                "preparation_tip": "Connect details of your previous roles to the requirements of the job description. Show that you did research on what this company builds."
            }
        ]

        return questions
