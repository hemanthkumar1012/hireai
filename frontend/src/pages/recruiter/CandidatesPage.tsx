import React, { useState, useEffect } from 'react';
import { applicationsApi, jobsApi } from '../../services/api';
import { Application, Job } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { MatchScoreMetric } from '../../components/dashboard/MatchScoreMetric';
import { Sparkles, Calendar, ArrowRight, User, ChevronDown, ChevronUp } from 'lucide-react';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';

export const CandidatesPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        applicationsApi.listRecruiter(),
        jobsApi.list()
      ]);
      setApplications(appsRes);
      setJobs(jobsRes);
    } catch (err) {
      console.error("Failed to load candidates data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setAlert(null);
    try {
      const updated = await applicationsApi.updateStatus(appId, newStatus);
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setAlert({ type: 'success', text: 'Candidate application status updated.' });
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update candidate status.' });
    }
  };

  const handleToggleExpand = (appId: number) => {
    if (expandedAppId === appId) {
      setExpandedAppId(null);
    } else {
      setExpandedAppId(appId);
    }
  };

  const filteredApps = selectedJobId === 'all'
    ? applications
    : applications.filter(app => app.job_id === parseInt(selectedJobId));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Candidate Pipelines</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Review candidates matching your postings, structured by AI alignment ranking.</p>
        </div>

        {/* Job Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Filter Job:</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 bg-brand-surface1 border border-brand-border rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Vacancies</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
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

      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isExpanded = expandedAppId === app.id;
            return (
              <Card key={app.id} className="p-0 border-brand-border overflow-hidden bg-brand-surface1/60">
                {/* Main Row */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-brand-surface1/60">
                  <div className="flex items-center gap-4">
                    <MatchScoreMetric score={app.match_score} size="md" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-200">{app.seeker?.full_name}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">applied for</span>
                        <Badge variant="primary">{app.job?.title}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{app.seeker?.email}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end border-t md:border-t-0 border-brand-border pt-3 md:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-2.5 py-1 bg-brand-surface2 border border-brand-border rounded-xl text-xs font-semibold text-slate-250 focus:outline-none"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleToggleExpand(app.id)}
                      className="p-2 bg-brand-surface2 border border-brand-border text-slate-400 hover:text-white rounded-xl flex items-center gap-1.5 text-[11px] font-bold transition"
                    >
                      {isExpanded ? (
                        <>
                          Hide Fit
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Verify Fit
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable AI Suitability Details */}
                {isExpanded && app.match_explanation && (
                  <div className="p-6 border-t border-brand-border bg-brand-surface2/25 space-y-6">
                    {/* Reuse AIInsightCard */}
                    <AIInsightCard
                      score={app.match_score}
                      title="AI Assessment Telemetry"
                      explanation={app.match_explanation.summary || ""}
                      recommendations={app.match_explanation.strengths || []}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Strengths */}
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4.5 rounded-2xl">
                        <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider block mb-2">Technical Strengths:</span>
                        <ul className="text-slate-350 space-y-1.5">
                          {app.match_explanation.strengths?.map((str, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="bg-red-950/20 border border-red-500/10 p-4.5 rounded-2xl">
                        <span className="font-bold text-red-400 uppercase text-[9px] tracking-wider block mb-2">Technical Discrepancies:</span>
                        <ul className="text-slate-350 space-y-1.5">
                          {app.match_explanation.weaknesses?.map((weak, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{weak}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Skills detail */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider block mb-2">Matched Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {app.match_explanation.matched_skills?.map((s, i) => (
                            <Badge key={i} variant="success">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-rose-400 uppercase text-[9px] tracking-wider block mb-2">Missing Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {app.match_explanation.missing_skills?.map((s, i) => (
                            <Badge key={i} variant="error">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No candidates found"
          description="Candidates applying to your posted vacancies will appear here prioritized by alignment score."
          icon={User}
        />
      )}
    </div>
  );
};
