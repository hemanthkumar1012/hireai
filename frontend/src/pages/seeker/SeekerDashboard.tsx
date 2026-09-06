import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  MapPin,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { applicationsApi, jobsApi, profilesApi } from '../../services/api';
import { Application, Job, JobSeekerProfile } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const statusConfig = [
  {
    key: 'APPLIED',
    label: 'Applied',
    color: '#6E5AE6',
    background: '#F3F0FF',
    border: '#E2DBFF',
  },
  {
    key: 'SCREENING',
    label: 'Screening',
    color: '#0071E3',
    background: '#EEF6FF',
    border: '#D8EBFF',
  },
  {
    key: 'INTERVIEW',
    label: 'Interview',
    color: '#B86B00',
    background: '#FFF7E8',
    border: '#F6E4BD',
  },
  {
    key: 'OFFER',
    label: 'Offer',
    color: '#248A3D',
    background: '#EFFAF1',
    border: '#D6EEDB',
  },
] as const;

export const SeekerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [appsRes, profileRes, jobsRes] = await Promise.all([
        applicationsApi.listSeeker(),
        profilesApi.getMyProfile(),
        jobsApi.list(),
      ]);

      setApplications(appsRes);
      setProfile(profileRes);
      setRecommendedJobs(jobsRes.slice(0, 3));
    } catch (error) {
      console.error('Failed to load seeker dashboard.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveJob = (jobId: number) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId],
    );
  };

  const handleApplyJob = async (jobId: number) => {
    setApplyingJobId(jobId);

    try {
      await applicationsApi.apply(jobId);
      window.alert('Application submitted successfully.');
      await fetchDashboardData();
    } catch (error: any) {
      window.alert(
        error?.response?.data?.detail || 'Unable to submit the application.',
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const seekerName = authState.user?.full_name || 'there';
  const completionPercentage = profile?.profile_completion || 82;
  const resumeReady = Boolean(profile?.resume_text || profile?.resume_analysis);
  const profileScore = profile?.resume_analysis?.ats_score || 85;
  const interviewCount = applications.filter(
    (application) => application.status === 'INTERVIEW',
  ).length;

  const statusApplications = (status: string) => {
    if (status === 'OFFER') {
      return applications.filter(
        (application) =>
          application.status === 'OFFER' || application.status === 'HIRED',
      );
    }

    return applications.filter((application) => application.status === status);
  };

  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (completionPercentage / 100) * ringCircumference;

  return (
    <div className="space-y-7 pb-10">
      <section className="grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-[#E6E0FF] bg-white px-6 py-7 shadow-[0_12px_32px_rgba(40,35,65,0.06)] sm:px-8">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#EEE9FF] blur-3xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5DEF9] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6655C8]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
              AI career workspace
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#1D1D1F] sm:text-[40px]">
                  Good morning, {seekerName}
                </h1>
                <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#6E6E73] sm:text-[15px]">
                  Your career workspace is ready. Review stronger matches, close skill gaps, and keep every application moving forward.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/seeker/profile')}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1D1D1F] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#303035]"
              >
                <UserRound className="h-4 w-4" strokeWidth={1.8} />
                Open profile
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#DDEBDD] bg-[#F4FBF5] px-3.5 py-2 text-[11px] font-semibold text-[#248A3D]">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                {resumeReady ? 'Resume analyzed' : 'Resume not analyzed'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7EB] bg-[#FAFAFC] px-3.5 py-2 text-[11px] font-semibold text-[#5D5D64]">
                <Target className="h-4 w-4" strokeWidth={1.8} />
                {applications.length} applications in progress
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E5E5EA] bg-white px-6 py-6 shadow-[0_12px_32px_rgba(40,35,65,0.05)]">
          <div className="flex h-full items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">
                Profile readiness
              </p>
              <p className="mt-2 text-[25px] font-bold tracking-[-0.03em] text-[#1D1D1F]">
                {completionPercentage}% complete
              </p>
              <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-[#6E6E73]">
                Finish your profile to improve search relevance and recruiter visibility.
              </p>
              <Link
                to="/seeker/profile"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6E5AE6]"
              >
                Complete profile
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>

            <div className="relative flex h-[94px] w-[94px] shrink-0 items-center justify-center">
              <svg className="-rotate-90" width="94" height="94" viewBox="0 0 94 94">
                <circle
                  cx="47"
                  cy="47"
                  r={ringRadius}
                  fill="none"
                  stroke="#EDEDF0"
                  strokeWidth="7"
                />
                <circle
                  cx="47"
                  cy="47"
                  r={ringRadius}
                  fill="none"
                  stroke="#6E5AE6"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <span className="absolute text-[14px] font-bold text-[#1D1D1F]">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Job matches"
          value={recommendedJobs.length + 9}
          icon={Briefcase}
          description="Roles aligned with your profile"
        />
        <MetricCard
          title="Applications"
          value={applications.length}
          icon={FileText}
          description="Applications currently tracked"
        />
        <MetricCard
          title="Interviews"
          value={interviewCount}
          icon={Calendar}
          description="Interview-stage applications"
        />
        <MetricCard
          title="Resume score"
          value={`${Math.round(profileScore)}/100`}
          icon={Award}
          description="Latest ATS compatibility score"
        />
      </section>

      <section className="rounded-[28px] border border-[#E5E5EA] bg-white shadow-[0_12px_32px_rgba(40,35,65,0.05)]">
        <div className="border-b border-[#EEEEF1] px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6E5AE6]">
                  <Sparkles className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">
                    Personalized guidance
                  </p>
                  <h2 className="mt-1 text-[18px] font-bold tracking-[-0.02em] text-[#1D1D1F]">
                    Your next career move
                  </h2>
                </div>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[#E7E2F8] bg-[#FAF9FF] px-3 py-1.5 text-[10px] font-semibold text-[#6E5AE6]">
              High-value focus
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3">
          <div className="border-b border-[#EEEEF1] px-6 py-6 md:border-b-0 md:border-r sm:px-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E5AE6]">
              Best-fit roles
            </p>
            <h3 className="mt-3 text-[20px] font-bold tracking-[-0.025em] text-[#1D1D1F]">
              Python backend engineering
            </h3>
            <p className="mt-2 text-[12px] leading-5 text-[#6E6E73]">
              Your current profile points strongly toward backend, API, and system-building roles.
            </p>
            <div className="mt-5 space-y-2.5 text-[12px] font-medium text-[#4A4A50]">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#34A853]" /> Python Backend Engineer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#34A853]" /> FastAPI Developer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#34A853]" /> Django Backend Engineer</div>
            </div>
          </div>

          <div className="border-b border-[#EEEEF1] px-6 py-6 md:border-b-0 md:border-r sm:px-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9342C]">
              Skills to strengthen
            </p>
            <h3 className="mt-3 text-[20px] font-bold tracking-[-0.025em] text-[#1D1D1F]">
              Close the gaps that matter
            </h3>
            <p className="mt-2 text-[12px] leading-5 text-[#6E6E73]">
              Prioritize practical platform skills that can make your backend profile more production-ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="error">Kubernetes</Badge>
              <Badge variant="error">Redis</Badge>
              <Badge variant="error">AWS Lambda</Badge>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#248A3D]">
              Recommended actions
            </p>
            <h3 className="mt-3 text-[20px] font-bold tracking-[-0.025em] text-[#1D1D1F]">
              Make the next step visible
            </h3>
            <div className="mt-4 space-y-3 text-[12px] leading-5 text-[#5D5D64]">
              <div className="flex gap-2.5">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#6E5AE6]" />
                <span>Build one production-style Redis caching project.</span>
              </div>
              <div className="flex gap-2.5">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#6E5AE6]" />
                <span>Add measurable outcomes to your strongest resume bullets.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">
              Recommended opportunities
            </p>
            <h2 className="mt-1 text-[25px] font-bold tracking-[-0.03em] text-[#1D1D1F]">
              Roles worth your attention
            </h2>
          </div>
          <Link
            to="/seeker/jobs"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6E5AE6]"
          >
            Explore all jobs
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => {
              const saved = savedJobs.includes(job.id);
              const skills = (job.skills_needed || []).slice(0, 3);

              return (
                <Card
                  key={job.id}
                  hoverEffect
                  className="flex h-full flex-col justify-between rounded-[24px] border-[#E5E5EA] bg-white p-0 shadow-[0_8px_24px_rgba(0,0,0,0.035)]"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A8A91]">
                          {job.company_name}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-[18px] font-bold leading-6 tracking-[-0.02em] text-[#1D1D1F]">
                          {job.title}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-full border border-[#DCEEDB] bg-[#F2FAF2] px-2.5 py-1 text-[10px] font-bold text-[#248A3D]">
                        92% match
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-[#6E6E73]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {job.location || 'Flexible'}
                      </span>
                      <span>{job.work_mode || 'Flexible work'}</span>
                      <span>{job.salary_range || 'Salary disclosed in role'}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill) => (
                          <Badge key={skill} variant="success" className="text-[9px]">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#8A8A91]">Skills not listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-[#EEEEF1] p-4">
                    <button
                      type="button"
                      onClick={() => handleSaveJob(job.id)}
                      aria-label={saved ? 'Remove saved job' : 'Save job'}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                        saved
                          ? 'border-[#D9D2FF] bg-[#F5F2FF] text-[#6E5AE6]'
                          : 'border-[#E2E2E7] bg-white text-[#6E6E73] hover:bg-[#F8F8FA] hover:text-[#1D1D1F]'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyJob(job.id)}
                      disabled={applyingJobId === job.id}
                      className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#1D1D1F] px-4 text-[11px] font-semibold text-white transition hover:bg-[#303035] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {applyingJobId === job.id ? 'Submitting...' : 'Apply now'}
                    </button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="lg:col-span-3 rounded-[24px] border border-dashed border-[#DCDCE1] bg-white px-6 py-12 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-[#A1A1A6]" strokeWidth={1.7} />
              <p className="mt-3 text-[14px] font-semibold text-[#1D1D1F]">No matching roles yet</p>
              <p className="mt-1 text-[12px] text-[#6E6E73]">Explore the jobs area to find your next opportunity.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">
            Application pipeline
          </p>
          <h2 className="mt-1 text-[25px] font-bold tracking-[-0.03em] text-[#1D1D1F]">
            Keep every application moving
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {statusConfig.map((column) => {
            const items = statusApplications(column.key);

            return (
              <div
                key={column.key}
                className="min-h-[210px] rounded-[22px] border border-[#E5E5EA] bg-[#FAFAFC] p-4"
              >
                <div className="flex items-center justify-between border-b border-[#E9E9ED] pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="text-[12px] font-semibold text-[#3F3F45]">{column.label}</span>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                    style={{ color: column.color, backgroundColor: column.background }}
                  >
                    {items.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {items.length > 0 ? (
                    items.map((application) => (
                      <div
                        key={application.id}
                        className="rounded-2xl border bg-white p-3.5 shadow-[0_5px_15px_rgba(0,0,0,0.03)]"
                        style={{ borderColor: column.border }}
                      >
                        <p className="truncate text-[12px] font-semibold text-[#1D1D1F]">
                          {application.job?.title || 'Application'}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-[#77777D]">
                          {application.job?.company_name || 'Company'}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-[#8A8A91]">
                          <span>{Math.round(application.match_score)}% match</span>
                          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#DCDCE1] px-3 py-8 text-center text-[11px] italic text-[#96969C]">
                      Nothing here yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate('/seeker/resume-intelligence')}
          className="group rounded-[24px] border border-[#E5E5EA] bg-white p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6E5AE6]">
              <FileText className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <ArrowRight className="h-5 w-5 text-[#A1A1A6] transition group-hover:translate-x-1 group-hover:text-[#6E5AE6]" strokeWidth={1.8} />
          </div>
          <h3 className="mt-5 text-[17px] font-bold text-[#1D1D1F]">Improve your resume</h3>
          <p className="mt-1.5 text-[12px] leading-5 text-[#6E6E73]">
            Run the ATS analyzer, inspect weak bullets, and turn the score into concrete edits.
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/seeker/career-insights')}
          className="group rounded-[24px] border border-[#E5E5EA] bg-white p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F8FF] text-[#0071E3]">
              <Target className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <ArrowRight className="h-5 w-5 text-[#A1A1A6] transition group-hover:translate-x-1 group-hover:text-[#0071E3]" strokeWidth={1.8} />
          </div>
          <h3 className="mt-5 text-[17px] font-bold text-[#1D1D1F]">Tune your career direction</h3>
          <p className="mt-1.5 text-[12px] leading-5 text-[#6E6E73]">
            Review role fit, missing skills, and the next projects that strengthen your profile.
          </p>
        </button>
      </div>
    </div>
  );
};
