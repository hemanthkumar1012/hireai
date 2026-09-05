import re
from typing import Any, Dict, List, Optional, Set, Tuple


SECTIONS = {
    "summary": [
        "summary",
        "professional summary",
        "career summary",
        "objective",
        "career objective",
        "profile",
    ],
    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "work history",
        "employment history",
    ],
    "education": [
        "education",
        "academic background",
        "academic qualifications",
    ],
    "skills": [
        "skills",
        "technical skills",
        "core skills",
        "key skills",
        "technologies",
    ],
    "projects": [
        "projects",
        "personal projects",
        "academic projects",
        "selected projects",
    ],
    "certifications": [
        "certifications",
        "certificates",
        "licenses",
    ],
    "achievements": [
        "achievements",
        "awards",
        "honors",
        "accomplishments",
    ],
}


KEYWORDS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "go",
    "golang",
    "rust",
    "php",
    "ruby",
    "kotlin",
    "swift",
    "react",
    "react.js",
    "angular",
    "vue",
    "next.js",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "fastapi",
    "django",
    "flask",
    "spring",
    "spring boot",
    "node.js",
    "node",
    "express",
    "rest api",
    "restful",
    "graphql",
    "microservices",
    "sql",
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "sqlite",
    "oracle",
    "dynamodb",
    "elasticsearch",
    "aws",
    "azure",
    "gcp",
    "google cloud",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "github actions",
    "ci/cd",
    "linux",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "ai",
    "pandas",
    "numpy",
    "scikit-learn",
    "pytorch",
    "tensorflow",
    "nlp",
    "git",
    "github",
    "unit testing",
    "pytest",
    "testing",
    "agile",
    "scrum",
    "jira",
    "api",
    "oauth",
    "jwt",
    "authentication",
    "authorization",
    "system design",
    "software architecture",
    "scalability",
    "security",
}


ACTION_WORDS = {
    "built",
    "developed",
    "designed",
    "implemented",
    "created",
    "engineered",
    "optimized",
    "automated",
    "integrated",
    "deployed",
    "led",
    "managed",
    "delivered",
    "improved",
    "reduced",
    "increased",
    "migrated",
    "refactored",
    "configured",
    "tested",
    "maintained",
    "launched",
    "analyzed",
    "streamlined",
}


WEAK_PHRASES = {
    "responsible for",
    "worked on",
    "helped with",
    "helped",
    "duties included",
    "was involved in",
    "worked with",
}


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("–", "-").replace("—", "-")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def contains(text: str, value: str) -> bool:
    text = normalize(text)
    value = normalize(value)

    if " " in value:
        return value in text

    return bool(
        re.search(
            rf"(?<![a-z0-9]){re.escape(value)}(?![a-z0-9])",
            text,
        )
    )


def find_sections(resume_text: str) -> Set[str]:
    found = set()
    text = normalize(resume_text)

    for section, names in SECTIONS.items():
        if any(name in text for name in names):
            found.add(section)

    return found


def find_keywords(text: str) -> Set[str]:
    return {
        keyword
        for keyword in KEYWORDS
        if contains(text, keyword)
    }


def get_contact_info(resume_text: str) -> Dict[str, bool]:
    return {
        "email": bool(
            re.search(
                r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
                resume_text,
                re.IGNORECASE,
            )
        ),
        "phone": bool(
            re.search(
                r"(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)",
                resume_text,
            )
        ),
        "linkedin": "linkedin.com" in resume_text.lower(),
        "github": "github.com" in resume_text.lower(),
    }


def keyword_score(
    resume_text: str,
    job_description: Optional[str],
) -> Tuple[int, List[str], List[str]]:
    resume_keywords = find_keywords(resume_text)

    if not job_description:
        if not resume_keywords:
            return 25, [], []

        score = min(100, 30 + len(resume_keywords) * 3)
        return score, sorted(resume_keywords), []

    job_keywords = find_keywords(job_description)

    if not job_keywords:
        score = min(100, 45 + len(resume_keywords) * 2)
        return score, sorted(resume_keywords), []

    matched = sorted(resume_keywords & job_keywords)
    missing = sorted(job_keywords - resume_keywords)

    score = round((len(matched) / len(job_keywords)) * 100)

    return score, matched, missing


def ats_compatibility_score(
    resume_text: str,
    sections: Set[str],
) -> int:
    contact = get_contact_info(resume_text)

    score = 0

    if contact["email"]:
        score += 25

    if contact["phone"]:
        score += 20

    if contact["linkedin"] or contact["github"]:
        score += 10

    if "experience" in sections:
        score += 15

    if "education" in sections:
        score += 10

    if "skills" in sections:
        score += 10

    if "summary" in sections:
        score += 5

    if "projects" in sections:
        score += 5

    return min(score, 100)


def experience_score(resume_text: str) -> int:
    text = normalize(resume_text)
    score = 0

    date_patterns = [
        r"\b20\d{2}\s*-\s*(?:20\d{2}|present|current)\b",
        r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+20\d{2}",
        r"\b\d{4}\s*-\s*\d{4}\b",
    ]

    dates = sum(
        len(re.findall(pattern, text, re.IGNORECASE))
        for pattern in date_patterns
    )

    score += min(35, dates * 12)

    roles = [
        "engineer",
        "developer",
        "intern",
        "analyst",
        "manager",
        "consultant",
        "designer",
        "specialist",
        "administrator",
        "architect",
        "lead",
    ]

    role_count = sum(
        1 for role in roles if contains(text, role)
    )

    score += min(30, role_count * 6)

    if "work experience" in text or "professional experience" in text:
        score += 20

    bullets = re.findall(
        r"(?:^|\n)\s*[-•*▪◦]\s+\S+",
        resume_text,
    )

    score += min(15, len(bullets) * 2)

    return min(score, 100)


def achievement_score(resume_text: str) -> int:
    text = normalize(resume_text)
    score = 0

    action_count = sum(
        1 for word in ACTION_WORDS if contains(text, word)
    )

    score += min(35, action_count * 5)

    metric_patterns = [
        r"\b\d+(?:\.\d+)?\s*%",
        r"\b\d+(?:\.\d+)?\s*x\b",
        r"\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:users|customers|clients|requests|records|transactions)\b",
        r"\b(?:rs\.?|₹|\$|€|£)\s*\d+(?:,\d{3})*(?:\.\d+)?\s*[km]?\b",
        r"\b\d+(?:\.\d+)?\s*(?:ms|seconds|minutes|hours|days)\b",
    ]

    metric_count = sum(
        len(re.findall(pattern, text, re.IGNORECASE))
        for pattern in metric_patterns
    )

    score += min(50, metric_count * 10)

    if "achievements" in find_sections(resume_text):
        score += 15

    return min(score, 100)


def formatting_score(
    resume_text: str,
    sections: Set[str],
) -> int:
    if not resume_text.strip():
        return 0

    words = re.findall(r"[a-zA-Z0-9+#./-]+", resume_text)
    word_count = len(words)

    score = 0

    if 300 <= word_count <= 1200:
        score += 30
    elif 200 <= word_count < 300 or 1200 < word_count <= 1600:
        score += 20
    elif 100 <= word_count < 200 or 1600 < word_count <= 2000:
        score += 10

    score += min(35, len(sections) * 5)

    lines = [
        line.strip()
        for line in resume_text.splitlines()
        if line.strip()
    ]

    if len(lines) >= 10:
        score += 10

    bullets = re.findall(
        r"(?:^|\n)\s*[-•*▪◦]\s+\S+",
        resume_text,
    )

    if bullets:
        score += 15

    bad_punctuation = len(
        re.findall(r"[!]{2,}|[?]{2,}|[.]{4,}", resume_text)
    )

    score -= min(10, bad_punctuation * 2)

    return max(0, min(score, 100))


def completeness_score(
    resume_text: str,
    sections: Set[str],
) -> int:
    contact = get_contact_info(resume_text)

    score = 0

    if contact["email"]:
        score += 20

    if contact["phone"]:
        score += 15

    if contact["linkedin"] or contact["github"]:
        score += 5

    if "summary" in sections:
        score += 10

    if "experience" in sections:
        score += 20

    if "education" in sections:
        score += 15

    if "skills" in sections:
        score += 10

    if "projects" in sections or "certifications" in sections:
        score += 5

    return min(score, 100)


def skills_score(
    resume_text: str,
    job_description: Optional[str],
) -> int:
    resume_keywords = find_keywords(resume_text)

    if job_description:
        job_keywords = find_keywords(job_description)

        if job_keywords:
            matched = resume_keywords & job_keywords
            return min(
                100,
                round((len(matched) / len(job_keywords)) * 100),
            )

    if not resume_keywords:
        return 20

    return min(100, 35 + len(resume_keywords) * 3)


def build_issues(
    resume_text: str,
    sections: Set[str],
    keyword: int,
    experience: int,
    achievements: int,
    formatting: int,
    completeness: int,
    job_description: Optional[str],
    missing_keywords: List[str],
) -> List[str]:
    issues = []
    contact = get_contact_info(resume_text)

    if not contact["email"]:
        issues.append("Add a professional email address.")

    if not contact["phone"]:
        issues.append("Add a phone number.")

    if "experience" not in sections:
        issues.append("Add a clearly labeled Work Experience section.")

    if "skills" not in sections:
        issues.append("Add a dedicated Skills or Technical Skills section.")

    if "education" not in sections:
        issues.append("Add an Education section.")

    if completeness < 60:
        issues.append(
            "Several important resume sections or contact details are missing."
        )

    if formatting < 60:
        issues.append(
            "Improve the resume structure with clear headings and consistent bullet formatting."
        )

    if experience < 50 and "experience" in sections:
        issues.append(
            "Add stronger descriptions of your responsibilities, technologies, and results."
        )

    if achievements < 45:
        issues.append(
            "Add measurable achievements where you have real numbers to support them."
        )

    if keyword < 60:
        if job_description and missing_keywords:
            keywords = ", ".join(missing_keywords[:6])
            issues.append(
                f"Some important job keywords are missing: {keywords}."
            )
        else:
            issues.append(
                "Add more relevant technical and role-specific keywords."
            )

    text = normalize(resume_text)

    weak_count = sum(
        1 for phrase in WEAK_PHRASES if phrase in text
    )

    if weak_count >= 2:
        issues.append(
            "Replace weak phrases such as 'responsible for' and 'worked on' with stronger action statements."
        )

    return issues[:10]


def build_recommendations(
    sections: Set[str],
    keyword: int,
    achievements: int,
    formatting: int,
    job_description: Optional[str],
    missing_keywords: List[str],
) -> List[str]:
    recommendations = []

    if "summary" not in sections:
        recommendations.append(
            "Add a short 2–4 line professional summary targeted toward your desired role."
        )

    if "skills" not in sections:
        recommendations.append(
            "Add a Technical Skills section and group related technologies together."
        )

    if formatting < 70:
        recommendations.append(
            "Use standard headings, simple bullet points, consistent spacing, and a clean layout."
        )

    if achievements < 60:
        recommendations.append(
            "Rewrite experience bullets using action, technology, task, and result. Only use real metrics."
        )

    if keyword < 70:
        if job_description and missing_keywords:
            keywords = ", ".join(missing_keywords[:8])
            recommendations.append(
                f"If you genuinely have these skills, include relevant keywords such as: {keywords}."
            )
        else:
            recommendations.append(
                "Add terminology that accurately reflects the role and your actual experience."
            )

    recommendations.append(
        "Mention important technologies in your experience or project descriptions when you actually used them."
    )

    recommendations.append(
        "Remove generic filler and focus on technical contributions, ownership, and measurable results."
    )

    recommendations.append(
        "Never add fake achievements, certifications, technologies, or metrics."
    )

    return recommendations[:10]


def score_label(score: int) -> str:
    if score >= 90:
        return "Excellent"
    if score >= 80:
        return "Strong"
    if score >= 70:
        return "Good"
    if score >= 60:
        return "Fair"
    if score >= 50:
        return "Needs Improvement"

    return "Weak"


def calculate_ats_score(
    resume_text: str,
    job_description: Optional[str] = None,
) -> Dict[str, Any]:
    if not resume_text or not resume_text.strip():
        return {
            "ats_score": 0,
            "score_label": "Weak",
            "category_scores": {
                "ats_compatibility": 0,
                "keywords": 0,
                "skills": 0,
                "experience": 0,
                "achievements": 0,
                "formatting": 0,
                "completeness": 0,
            },
            "matched_keywords": [],
            "missing_keywords": [],
            "detected_sections": [],
            "issues": ["No readable resume text was provided."],
            "recommendations": [
                "Upload a readable PDF or DOCX resume.",
            ],
        }

    sections = find_sections(resume_text)

    keyword, matched_keywords, missing_keywords = keyword_score(
        resume_text,
        job_description,
    )

    compatibility = ats_compatibility_score(
        resume_text,
        sections,
    )

    skills = skills_score(
        resume_text,
        job_description,
    )

    experience = experience_score(resume_text)

    achievements = achievement_score(resume_text)

    formatting = formatting_score(
        resume_text,
        sections,
    )

    completeness = completeness_score(
        resume_text,
        sections,
    )

    categories = {
        "ats_compatibility": compatibility,
        "keywords": keyword,
        "skills": skills,
        "experience": experience,
        "achievements": achievements,
        "formatting": formatting,
        "completeness": completeness,
    }

    weights = {
        "ats_compatibility": 0.20,
        "keywords": 0.20,
        "skills": 0.15,
        "experience": 0.15,
        "achievements": 0.10,
        "formatting": 0.10,
        "completeness": 0.10,
    }

    total = sum(
        categories[name] * weights[name]
        for name in categories
    )

    ats_score = round(total)

    issues = build_issues(
        resume_text,
        sections,
        keyword,
        experience,
        achievements,
        formatting,
        completeness,
        job_description,
        missing_keywords,
    )

    recommendations = build_recommendations(
        sections,
        keyword,
        achievements,
        formatting,
        job_description,
        missing_keywords,
    )

    return {
        "ats_score": max(0, min(100, ats_score)),
        "score_label": score_label(ats_score),
        "category_scores": categories,
        "matched_keywords": matched_keywords[:50],
        "missing_keywords": missing_keywords[:50],
        "detected_sections": sorted(sections),
        "issues": issues,
        "recommendations": recommendations,
    }
