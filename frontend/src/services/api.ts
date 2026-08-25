import axios from 'axios';
import { User, Job, JobSeekerProfile, Application, InterviewQuestion } from '../types';

const API_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto token injector
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hireai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Token refresh interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/register'
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('hireai_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = res.data;
          localStorage.setItem('hireai_token', access_token);
          localStorage.setItem('hireai_refresh_token', refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('hireai_token');
          localStorage.removeItem('hireai_refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  async register(data: any) {
    const res = await apiClient.post('/auth/register', data);
    return res.data; // { access_token, refresh_token, token_type, user }
  },
  async login(data: any) {
    const res = await apiClient.post('/auth/login', data);
    return res.data; // { access_token, refresh_token, token_type, user }
  },
  async refresh(refreshToken: string) {
    const res = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return res.data;
  },
  async logout() {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  async getMe(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  async forgotPassword(email: string) {
    const res = await apiClient.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    return res.data;
  }
};

// Jobs APIs
export const jobsApi = {
  async list(search?: string): Promise<Job[]> {
    const res = await apiClient.get('/jobs/', { params: { search } });
    return res.data;
  },
  async saved(): Promise<Job[]> {
    const res = await apiClient.get('/jobs/saved');
    return res.data;
  },
  async save(id: number): Promise<void> {
    await apiClient.post(`/jobs/${id}/save`);
  },
  async unsave(id: number): Promise<void> {
    await apiClient.delete(`/jobs/${id}/save`);
  },
  async get(id: number): Promise<Job> {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  },
  async create(data: Partial<Job>): Promise<Job> {
    const res = await apiClient.post('/jobs/', data);
    return res.data;
  },
  async update(id: number, data: Partial<Job>): Promise<Job> {
    const res = await apiClient.put(`/jobs/${id}`, data);
    return res.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  }
};

// Profiles APIs
export const profilesApi = {
  async getMyProfile(): Promise<JobSeekerProfile> {
    const res = await apiClient.get('/profiles/me');
    return res.data;
  },
  async updateMyProfile(data: Partial<JobSeekerProfile>): Promise<JobSeekerProfile> {
    const res = await apiClient.put('/profiles/me', data);
    return res.data;
  },
  async parseResume(resumeText: string): Promise<JobSeekerProfile> {
    const res = await apiClient.post('/profiles/me/parse-resume', { resume_text: resumeText });
    return res.data;
  },
  async analyzeGaps(targetRole: string, targetSkills: string[]): Promise<JobSeekerProfile> {
    const res = await apiClient.post('/profiles/me/gap-analysis', {
      target_role: targetRole,
      target_skills: targetSkills,
    });
    return res.data;
  }
};

// Applications APIs
export const applicationsApi = {
  async apply(jobId: number): Promise<Application> {
    const res = await apiClient.post('/applications/', { job_id: jobId });
    return res.data;
  },
  async listSeeker(): Promise<Application[]> {
    const res = await apiClient.get('/applications/seeker');
    return res.data;
  },
  async listRecruiter(jobId?: number): Promise<Application[]> {
    const res = await apiClient.get('/applications/recruiter', { params: { job_id: jobId } });
    return res.data;
  },
  async get(id: number): Promise<Application> {
    const res = await apiClient.get(`/applications/${id}`);
    return res.data;
  },
  async updateStatus(id: number, status: string): Promise<Application> {
    const res = await apiClient.put(`/applications/${id}/status?status_in=${status}`);
    return res.data;
  }
};
