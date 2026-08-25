import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../../services/api';
import { Application } from '../../types';
import { ApplicationCard } from '../../components/dashboard/ApplicationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MatchScoreMetric } from '../../components/dashboard/MatchScoreMetric';
import { X, Sparkles, BookOpen, User, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await applicationsApi.listSeeker();
      setApplications(res);
    } catch (err) {
      console.error("Failed to load user applications.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleOpenDetails = (appId: number) => {
    const app = applications.find(a => a.id === appId);
    if (app) setSelectedApp(app);
  };

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Applications Tracking</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review active application stages along with specialized AI-generated interview prep tips.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications tracked yet"
          description="Find a matching vacancy in our catalog and apply to compute suitability ratings."
          icon={BookOpen}
        />
      )}

      {/* Slide-out Insights Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          {/* Dismiss Click Area */}
          <div className="flex-1" onClick={() => setSelectedApp(null)} />
          
          <aside className="w-full max-w-xl bg-brand-surface1 border-l border-brand-border h-full flex flex-col shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="h-16 border-b border-brand-border px-6 flex items-center justify-between bg-brand-surface2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Suitability Analysis</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-brand-surface1 rounded-xl transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Job Info Summary */}
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{selectedApp.job?.title}</h4>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">{selectedApp.job?.company_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Match Score</span>
                  <MatchScoreMetric score={selectedApp.match_score} size="md" />
                </div>
              </div>

              {/* Match Explanation */}
              {selectedApp.match_explanation && (
                <div className="space-y-4">
                  {/* Reuse AIInsightCard */}
                  <AIInsightCard
                    score={selectedApp.match_score}
                    title="Evaluation Telemetry"
                    explanation={selectedApp.match_explanation.summary || ""}
                    recommendations={selectedApp.match_explanation.strengths || []}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-emerald-550/5 border border-emerald-500/10 p-4.5 rounded-2xl">
                      <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2.5">Key Strengths</h5>
                      <ul className="text-xs text-slate-350 space-y-2 leading-relaxed">
                        {selectedApp.match_explanation.strengths?.map((str, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-950/20 border border-red-500/10 p-4.5 rounded-2xl">
                      <h5 className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2.5">Identified Gaps</h5>
                      <ul className="text-xs text-slate-350 space-y-2 leading-relaxed">
                        {selectedApp.match_explanation.weaknesses?.map((weak, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skills Compare */}
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Matched Competencies</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.match_explanation.matched_skills?.map((s, i) => (
                        <Badge key={i} variant="success">{s}</Badge>
                      ))}
                      {(!selectedApp.match_explanation.matched_skills || selectedApp.match_explanation.matched_skills.length === 0) && (
                        <span className="text-xs text-slate-500 font-semibold">None detected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Unmatched Competencies</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.match_explanation.missing_skills?.map((s, i) => (
                        <Badge key={i} variant="error">{s}</Badge>
                      ))}
                      {(!selectedApp.match_explanation.missing_skills || selectedApp.match_explanation.missing_skills.length === 0) && (
                        <span className="text-xs text-slate-500 font-semibold">None detected</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tailored Interview Preparation */}
              {selectedApp.interview_questions && selectedApp.interview_questions.length > 0 && (
                <div className="border-t border-brand-border pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tailored Prep Questions</h5>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedApp.interview_questions.map((q, idx) => (
                      <Card key={idx} className="bg-[#070A0F]/50 border-brand-border p-4.5 rounded-2xl space-y-3 shadow-md">
                        <div className="flex items-start justify-between gap-3">
                          <h6 className="text-[11px] font-bold text-slate-205 leading-normal">
                            {idx + 1}. {q.question}
                          </h6>
                          <Badge variant="info" className="text-[8px] tracking-wide shrink-0">{q.type}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="bg-brand-surface1 border border-brand-border p-3.5 rounded-xl">
                            <span className="font-bold text-indigo-405 text-[9px] uppercase tracking-wider block mb-1">Key talking points:</span>
                            <ul className="text-slate-450 space-y-1.5">
                              {q.expected_answer_points.map((p, i) => (
                                <li key={i} className="flex gap-2 items-start text-[11px] leading-relaxed">
                                  <span className="text-indigo-400 mt-0.5">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-3 border border-dashed border-indigo-500/10 rounded-xl text-[10px] text-slate-400 leading-normal bg-indigo-500/5">
                            <span className="font-bold text-indigo-300">Preparation Tip:</span> {q.preparation_tip}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
