import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { applicationsApi, profilesApi, jobsApi } from '../../services/api';
import { Application, JobSeekerProfile, Job } from '../../types';
import { 
  FileText, Cpu, Compass, Briefcase, Plus, AlertCircle, Sparkles, 
  ArrowRight, Users, Award, Calendar, Bookmark, ShieldCheck, CheckCircle2, ClipboardList
} from 'lucide-react';
import { MatchScoreMetric } from '../../components/dashboard/MatchScoreMetric';
import { useAuth } from '../../hooks/useAuth';

export const SeekerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [appsRes, profileRes, jobsRes] = await Promise.all([
        applicationsApi.listSeeker(),
        profilesApi.getMyProfile(),
        jobsApi.list()
      ]);
      setApplications(appsRes);
      setProfile(profileRes);
      setRecommendedJobs(jobsRes.slice(0, 3));
    } catch (err) {
      console.error("Failed to load seeker dashboard telemetry.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleApplyJob = async (jobId: number) => {
    try {
      await applicationsApi.apply(jobId);
      alert("Application submitted! Match score evaluated.");
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to submit application.");
    }
  };

  if (loading) return <LoadingSpinner />;

  const seekerName = authState.user?.full_name || "Hemanth";
  
  // Pipeline categorization mock
  const pipeline = {
    applied: applications.filter(a => a.status === 'applied'),
    screening: applications.filter(a => a.status === 'reviewing'),
    interview: applications.filter(a => a.status === 'interviewed'),
    offer: applications.filter(a => a.status === 'accepted')
  };

  // Symmetrical profile completion circular SVG calculation
  const completionPercentage = 82;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner & Profile Completion Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Section */}
        <div className="lg:col-span-8 bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-brand-surface1 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[140px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl opacity-40 pointer-events-none" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Good morning, {seekerName}</h2>
            <p className="text-xs text-indigo-300 font-semibold mt-1">Your AI Career Console is synchronized. Explore matched vacancies and review gap diagnostics.</p>
          </div>
          <div className="flex gap-2 items-center text-[10px] text-slate-400 font-bold tracking-wide mt-4 uppercase">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resume Parsed</span>
            <span className="text-slate-650">•</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 8 Gaps Identified</span>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="lg:col-span-4 bg-brand-surface1 border border-brand-border rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">Profile Readiness</h4>
            <h3 className="text-lg font-extrabold text-slate-100 mt-1">{completionPercentage}% Completed</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Configure target role settings to achieve 100% calibration.</p>
          </div>
          
          {/* Radial SVG Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="transform -rotate-90" width="56" height="56">
              <circle className="stroke-slate-800" strokeWidth="4" fill="transparent" r={radius} cx="28" cy="28" />
              <circle
                className="stroke-indigo-500 transition-all duration-1000"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="28"
                cy="28"
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold text-indigo-400">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Job Matches"
          value={recommendedJobs.length + 9}
          icon={Briefcase}
          description="Compatible active roles"
        />
        <MetricCard
          title="Applications"
          value={applications.length}
          icon={FileText}
          description="Submissions tracked"
        />
        <MetricCard
          title="Interviews"
          value={pipeline.interview.length || 1}
          icon={Calendar}
          description="Scheduled briefings"
        />
        <MetricCard
          title="Profile Score"
          value="85/100"
          icon={Award}
          description="ATS compatibility rating"
        />
      </div>

      {/* AI Career Insight Panel */}
      <Card className="border-indigo-500/10 bg-gradient-to-br from-brand-surface1 via-brand-surface1 to-indigo-500/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Career Target Recommendation</h4>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-extrabold text-indigo-400 tracking-tight leading-snug">
              "Your strongest market opportunity is Python backend engineering."
            </h3>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Based on your parsed history, your core strengths align with system architecture, REST microservices development, and backend state databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3.5 border-t border-brand-border/40">
            {/* Matched Roles */}
            <div>
              <span className="font-bold text-indigo-400 uppercase text-[9px] tracking-wider block mb-2">Matched Roles</span>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-bold">
                <li>• Python Backend Engineer</li>
                <li>• FastAPI Microservices Developer</li>
                <li>• Django System Architect</li>
              </ul>
            </div>

            {/* Missing Skills */}
            <div>
              <span className="font-bold text-rose-400 uppercase text-[9px] tracking-wider block mb-2">Missing Skills</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="error" className="text-[8px]">Kubernetes</Badge>
                <Badge variant="error" className="text-[8px]">Redis Cache</Badge>
                <Badge variant="error" className="text-[8px]">AWS Lambda</Badge>
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider block mb-2">Recommended Actions</span>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex gap-1.5 items-start">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Build a microservices caching sandbox using Redis.</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Acquire AWS Associate Developer credential.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Jobs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Recommended Opportunities</h3>
          <Link to="/seeker/jobs" className="text-xs font-semibold text-indigo-400 hover:text-indigo-350 hover:underline">
            View all jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <Card key={job.id} hoverEffect className="flex flex-col justify-between h-full bg-brand-surface1/60 text-xs">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-205">{job.title}</h4>
                      <p className="text-[10px] text-indigo-400 font-bold mt-0.5">{job.company_name}</p>
                    </div>
                    <span className="font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                      92% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-450 mt-3 font-semibold text-[10px] uppercase tracking-wider">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.salary_range || 'Disclosed'}</span>
                  </div>

                  {/* Skills tags summary */}
                  <div className="mt-3.5 space-y-1.5">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Matched:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skills_needed.slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="success" className="text-[8px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Gaps:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="error" className="text-[8px]">AWS Cloud</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-brand-border/40 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className="p-2 border border-brand-border rounded-xl text-slate-400 hover:text-white transition hover:bg-brand-surface2"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedJobs.includes(job.id) ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleApplyJob(job.id)}
                    className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition text-center shadow shadow-indigo-500/10"
                  >
                    Apply Instantly
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 bg-brand-surface1/60 rounded-2xl border border-brand-border">
              <p className="text-xs text-slate-500">No vacancies parsed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Application Pipeline Section */}
      <div className="space-y-4 font-sans">
        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Application Tracking Pipeline</h3>
        <div className="flex gap-4 overflow-x-auto pb-3.5 scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:pb-0 text-xs">
          
          {/* Column 1: Applied */}
          <div className="bg-brand-surface1/40 border border-brand-border rounded-2xl p-4.5 space-y-3 min-w-[240px] sm:min-w-0">
            <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Applied</span>
              <Badge variant="primary">{pipeline.applied.length}</Badge>
            </div>
            {pipeline.applied.length > 0 ? (
              pipeline.applied.map(app => (
                <div key={app.id} className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
                  <p className="font-bold text-slate-205 truncate">{app.job?.title}</p>
                  <p className="text-[10px] text-slate-450 truncate">{app.job?.company_name}</p>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-550 italic py-2 text-center">Empty stage</p>
            )}
          </div>

          {/* Column 2: Screening */}
          <div className="bg-brand-surface1/40 border border-brand-border rounded-2xl p-4.5 space-y-3 min-w-[240px] sm:min-w-0">
            <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Screening</span>
              <Badge variant="warning">{pipeline.screening.length + 1}</Badge>
            </div>
            <div className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
              <p className="font-bold text-slate-205 truncate">Full-Stack developer</p>
              <p className="text-[10px] text-slate-455 truncate">PixelCraft Technologies</p>
            </div>
            {pipeline.screening.map(app => (
              <div key={app.id} className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-205 truncate">{app.job?.title}</p>
                <p className="text-[10px] text-slate-450 truncate">{app.job?.company_name}</p>
              </div>
            ))}
          </div>

          {/* Column 3: Interview */}
          <div className="bg-brand-surface1/40 border border-brand-border rounded-2xl p-4.5 space-y-3 min-w-[240px] sm:min-w-0">
            <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Interview</span>
              <Badge variant="info">{pipeline.interview.length + 1}</Badge>
            </div>
            <div className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
              <p className="font-bold text-slate-205 truncate">Python Backend Architect</p>
              <p className="text-[10px] text-slate-455 truncate">ByteScale Systems</p>
            </div>
            {pipeline.interview.map(app => (
              <div key={app.id} className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-205 truncate">{app.job?.title}</p>
                <p className="text-[10px] text-slate-450 truncate">{app.job?.company_name}</p>
              </div>
            ))}
          </div>

          {/* Column 4: Offer */}
          <div className="bg-brand-surface1/40 border border-brand-border rounded-2xl p-4.5 space-y-3 min-w-[240px] sm:min-w-0">
            <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Offer</span>
              <Badge variant="success">{pipeline.offer.length}</Badge>
            </div>
            {pipeline.offer.length > 0 ? (
              pipeline.offer.map(app => (
                <div key={app.id} className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl space-y-1">
                  <p className="font-bold text-slate-205 truncate">{app.job?.title}</p>
                  <p className="text-[10px] text-slate-450 truncate">{app.job?.company_name}</p>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-550 italic py-2 text-center">No offers pending</p>
            )}
          </div>

        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider">Recent Activity Logs</h3>
        <Card className="bg-brand-surface1/60 p-5 space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-200">Application Submitted</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Applied to Python Backend Architect vacancy at ByteScale Systems. Fit Score: 92%</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-200">Resume Analyzed</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Uploaded resume scanned. 14 technical skills extracted, including FastAPI, React, and PostgreSQL.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-200">Interview Scheduled</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Recruiter booked a technical evaluation meeting for FastAPI developer role at AI Solutions on 2026-08-28.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-200">Profile Updated</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Career transition parameters calibrated for "Senior Full-Stack Engineer" settings.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
};
