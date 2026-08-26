export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  recruiter_id: number;
  company_id?: number;
  title: string;
  slug?: string;
  description: string;
  company_name: string;
  location: string;
  work_mode: string;
  employment_type: string;
  min_salary?: number;
  max_salary?: number;
  currency: string;
  salary_range?: string;
  experience_min?: number;
  experience_max?: number;
  skills_needed: string[];
  requirements: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  is_active: boolean;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  field_of_study: string;
  year: string;
}

export interface CareerInsights {
  target_role: string;
  target_skills: string[];
  gaps: string[];
  recommendations: string[];
  suggested_actions: string[];
}

export interface JobSeekerProfile {
  id: number;
  user_id: number;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  years_of_experience?: number;
  current_company?: string;
  current_role?: string;
  expected_salary?: string;
  preferred_job_type?: string;
  preferred_work_mode?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_text?: string;
  skills: string[];
  work_history: Experience[];
  education: Education[];
  career_goals?: string;
  career_insights: Partial<CareerInsights>;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  description?: string;
  location?: string;
  company_size?: string;
  founded_year?: number;
  created_at: string;
  updated_at: string;
}

export interface MatchExplanation {
  summary: string;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'background';
  expected_answer_points: string[];
  preparation_tip: string;
}

export interface Application {
  id: number;
  job_id: number;
  seeker_id: number;
  cover_letter?: string;
  status: 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
  match_score: number;
  match_explanation: Partial<MatchExplanation>;
  interview_questions: InterviewQuestion[];
  created_at: string;
  updated_at: string;
  job?: Job;
  seeker?: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface JobSearchParams {
  search?: string;
  location?: string;
  work_mode?: string;
  employment_type?: string;
  experience_min?: number;
  experience_max?: number;
  salary_min?: number;
  salary_max?: number;
  company?: string;
  skills?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}
