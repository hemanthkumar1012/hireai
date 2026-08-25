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
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary_range?: string;
  skills_needed: string[];
  requirements: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  resume_text?: string;
  skills: string[];
  work_history: Experience[];
  education: Education[];
  career_goals?: string;
  career_insights: Partial<CareerInsights>;
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
  status: 'applied' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
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
