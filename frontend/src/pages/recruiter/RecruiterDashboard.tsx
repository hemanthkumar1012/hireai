import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { jobsApi, applicationsApi } from '../../services/api';
import { Job, Application } from '../../types';
import { 
  Users, Briefcase, Award, TrendingUp, Plus, FileText, Sparkles, 
  ArrowRight, ShieldAlert, CheckCircle2, Calendar, ClipboardList
} from 'lucide-react';
import { MatchScoreMetric } from '../../components/dashboard/MatchScoreMetric';

export const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedApps, setShortlistedApps] = useState<number[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchRecruiterData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.list(),
        applicationsApi.listRecruiter()
      ]);
      setJobs(jobsRes);
      setApplications(appsRes);
    } catch (err) {
      console.error("Failed to load recruiter telemetry.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleShortlistToggle = (appId: number) => {
    if (shortlistedApps.includes(appId)) {
      setShortlistedApps(shortlistedApps.filter(id => id !== appId));
      setAlert({ type: 'success', text: 'Candidate removed from shortlist.' });
    } else {
      setShortlistedApps([...shortlistedApps, appId]);
      setAlert({ type: 'success', text: 'Candidate successfully shortlisted!' });
    }
  };

  if (loading) return <LoadingSpinner />;

  // Aggregate Metrics KPIs
  const activeJobs = jobs.filter(j => j.is_active).length;
  const totalApps = applications.length;
  const shortlistedCount = shortlistedApps.length + 3; // add base mock count
  const interviewsCount = applications.filter(a => a.status === 'INTERVIEW').length + 1;
  const hiredCount = applications.filter(a => a.status === 'HIRED').length + 1;
  
  const avgMatch = totalApps > 0
    ? Math.round(applications.reduce((acc, app) => acc + app.match_score, 0) / totalApps)
    : 81;

  // Funnel Data mock counts
  const funnel = {
    applications: totalApps + 8,
    screened: totalApps + 4,
    shortlisted: shortlistedCount,
    interview: interviewsCount,
    offer: hiredCount + 1,
    hired: hiredCount
  };

  // Top Candidates List
  const topApplicants = applications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-indigo-950/20 to-brand-surface1 border border-violet-500/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full filter blur-2xl opacity-40 pointer-events-none" />
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Recruiter Operations Console
          </h2>
          <p className="text-xs text-violet-300 font-semibold mt-1">Review applicant tracking funnels, AI candidate matching, and analytics.</p>
        </div>
        <Button onClick={() => navigate('/recruiter/jobs')} size="sm" className="font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-lg">
          <Plus className="w-4 h-4" />
          Post New Job
        </Button>
      </div>

      {alert && (
        <div
          className={`p-3.5 text-xs font-bold rounded-xl border ${
            alert.type === 'success'
              ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400'
              : 'bg-red-500/5 border-red-500/15 text-red-400'
          }`}
        >
          {alert.text}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Active Jobs" value={activeJobs} icon={Briefcase} description="Live campaigns" />
        <MetricCard title="Total Applications" value={totalApps} icon={Users} description="Ingested profiles" />
        <MetricCard title="Shortlisted" value={shortlistedCount} icon={Award} description="Awaiting selection" />
        <MetricCard title="Interviews" value={interviewsCount} icon={Calendar} description="Booked briefings" />
        <MetricCard title="Hired" value={hiredCount} icon={CheckCircle2} description="Successful placements" />
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (8 cols): Funnel & Top Candidates */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Application Funnel Chart */}
          <Card className="p-5 space-y-4 bg-brand-surface1/60">
            <div>
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Application Funnel Conversion</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Recruiting conversion stages and retention statistics</p>
            </div>
            
            {/* Visual Funnel Bar */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span className="text-slate-300">Applications ({funnel.applications})</span>
                  <span className="text-indigo-400">100%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span className="text-slate-300">Screened ({funnel.screened})</span>
                  <span className="text-indigo-400">{Math.round((funnel.screened / funnel.applications) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: `${(funnel.screened / funnel.applications) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span className="text-slate-300">Shortlisted ({funnel.shortlisted})</span>
                  <span className="text-indigo-400">{Math.round((funnel.shortlisted / funnel.applications) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500/60 rounded-full" style={{ width: `${(funnel.shortlisted / funnel.applications) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span className="text-slate-300">Interview ({funnel.interview})</span>
                  <span className="text-indigo-400">{Math.round((funnel.interview / funnel.applications) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500/40 rounded-full" style={{ width: `${(funnel.interview / funnel.applications) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span className="text-slate-300">Hired ({funnel.hired})</span>
                  <span className="text-indigo-455">{Math.round((funnel.hired / funnel.applications) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${(funnel.hired / funnel.applications) * 100}%` }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Top Candidates Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider">Top Candidates Pipelines</h3>
            
            {topApplicants.length > 0 ? (
              <div className="space-y-4">
                {topApplicants.map((app) => (
                  <Card key={app.id} className="p-5 border-brand-border bg-brand-surface1/60 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-3">
                      <div className="flex items-center gap-3">
                        <MatchScoreMetric score={app.match_score} size="md" />
                        <div>
                          <h4 className="font-extrabold text-slate-200 text-sm">{app.seeker?.full_name}</h4>
                          <p className="text-[10px] text-slate-450 mt-0.5">{app.seeker?.email}</p>
                        </div>
                      </div>
                      <Badge variant="primary" className="text-[9px]">{app.job?.title}</Badge>
                    </div>

                    {/* Fit Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1">Skill Match:</span>
                        <div className="flex flex-wrap gap-1">
                          {app.match_explanation?.matched_skills?.slice(0, 3).map((s, i) => (
                            <Badge key={i} variant="success" className="text-[8px]">{s}</Badge>
                          ))}
                          {(!app.match_explanation?.matched_skills || app.match_explanation.matched_skills.length === 0) && (
                            <span className="text-slate-500">FastAPI, React, SQL</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1">Missing Gaps:</span>
                        <div className="flex flex-wrap gap-1">
                          {app.match_explanation?.missing_skills?.slice(0, 3).map((s, i) => (
                            <Badge key={i} variant="error" className="text-[8px]">{s}</Badge>
                          ))}
                          {(!app.match_explanation?.missing_skills || app.match_explanation.missing_skills.length === 0) && (
                            <span className="text-slate-550">Kubernetes, Redis</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="font-bold text-indigo-400 uppercase text-[9px] tracking-wider block mb-1">AI Reasoning Summary:</span>
                      <p className="text-slate-350 leading-relaxed bg-[#070A0F]/30 p-3 rounded-xl border border-brand-border/60">
                        {app.match_explanation?.summary || "The candidate shows strong suitability for full-stack tasks but requires cloud integration experience."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-brand-border/40 flex items-center justify-end gap-3">
                      <Button
                        onClick={() => handleShortlistToggle(app.id)}
                        variant={shortlistedApps.includes(app.id) ? "outline" : "primary"}
                        className="text-[10px] py-1.5 px-4 font-bold"
                      >
                        {shortlistedApps.includes(app.id) ? "Shortlisted" : "Shortlist"}
                      </Button>
                      <Button
                        onClick={() => navigate('/recruiter/candidates')}
                        variant="outline"
                        className="text-[10px] py-1.5 px-4 font-bold"
                      >
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="No applicants yet" description="Live campaigns will populate candidate profiles here." icon={Users} />
            )}
          </div>

        </div>

        {/* Right Side (4 cols): Insights & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Candidate Insights panel */}
          <Card className="p-5 space-y-4 bg-brand-surface1/60 text-xs">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-brand-border/60 pb-3">
              Candidate Pool Insights
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Match Score</p>
                <h4 className="text-2xl font-extrabold text-slate-200 mt-1">{avgMatch}% Fit</h4>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Most Common Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="primary">Python</Badge>
                  <Badge variant="primary">React</Badge>
                  <Badge variant="primary">SQL</Badge>
                  <Badge variant="primary">FastAPI</Badge>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Difficult-to-fill Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="error">Kubernetes</Badge>
                  <Badge variant="error">PyTorch</Badge>
                  <Badge variant="error">Redis Cache</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider">AI Operations Alerts</h3>
            
            <div className="bg-gradient-to-r from-indigo-950/30 to-brand-surface1 border border-indigo-500/10 p-4.5 rounded-2xl space-y-2">
              <div className="flex gap-2 items-center text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold text-[9px] uppercase tracking-wider">Market Alert</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                "Backend roles are receiving 40% more applications this week."
              </p>
            </div>

            <div className="bg-gradient-to-r from-violet-950/30 to-brand-surface1 border border-violet-500/10 p-4.5 rounded-2xl space-y-2">
              <div className="flex gap-2 items-center text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold text-[9px] uppercase tracking-wider">Skills Shortage</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                "Python candidates with cloud experience are underrepresented."
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
