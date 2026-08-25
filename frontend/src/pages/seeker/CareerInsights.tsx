import React, { useState, useEffect } from 'react';
import { profilesApi } from '../../services/api';
import { JobSeekerProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Compass, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';

export const CareerInsights: React.FC = () => {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [targetSkillsInput, setTargetSkillsInput] = useState('FastAPI, React, TypeScript, Docker, Kubernetes, AWS, SQL, Redis');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await profilesApi.getMyProfile();
      setProfile(res);
      if (res.career_insights?.target_role) {
        setTargetRole(res.career_insights.target_role);
      }
      if (res.career_insights?.target_skills) {
        setTargetSkillsInput(res.career_insights.target_skills.join(', '));
      }
    } catch (err) {
      console.error("Failed to load seeker profile.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setAlert(null);
    try {
      const skillsArray = targetSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      const updatedProfile = await profilesApi.analyzeGaps(targetRole, skillsArray);
      setProfile(updatedProfile);
      setAlert({ type: 'success', text: 'Career gap analysis updated successfully!' });
    } catch (err: any) {
      setAlert({ type: 'error', text: 'Failed to run gap analysis. Ensure your CV text is parsed first.' });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const insights = profile?.career_insights;
  const currentSkills = profile?.skills || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">AI Career Gap Insights</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Specify your desired career transition role to identify missing technical competencies and actionable step-by-step guidelines.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-5">
          <Card className="space-y-4 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Compass className="w-4 h-4 text-indigo-400" />
              Define Career Goal
            </h3>
            
            <form onSubmit={handleAnalyze} className="space-y-4">
              <Input
                label="Target Job Title"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                required
              />

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 font-sans">
                  Core Required Tech Stack (comma separated)
                </label>
                <textarea
                  value={targetSkillsInput}
                  onChange={(e) => setTargetSkillsInput(e.target.value)}
                  placeholder="e.g. Python, Docker, AWS"
                  rows={5}
                  className="w-full px-3.5 py-2.5 bg-brand-surface2/60 border border-brand-border rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
                  required
                />
              </div>

              <Button type="submit" isLoading={analyzing} className="w-full font-bold py-2.5 text-xs shadow-lg">
                Perform Gap Analysis
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          <Card className="space-y-6 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Analysis Results
            </h3>

            {insights && insights.target_role ? (
              <div className="space-y-6 text-xs">
                {/* Reuse AIInsightCard */}
                <AIInsightCard
                  title="Upskilling Strategy"
                  explanation={`We mapped your resume against the "${insights.target_role}" profile. You have achieved some capabilities, but lack critical dependencies details.`}
                  recommendations={insights.recommendations || []}
                />

                {/* Gaps List */}
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Identified Competency Gaps</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {insights.gaps && insights.gaps.length > 0 ? (
                      insights.gaps.map((gap, idx) => (
                        <Badge key={idx} variant="error" className="text-[9px]">
                          {gap}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="success">No technical gaps identified!</Badge>
                    )}
                  </div>
                </div>

                {/* Suggested Action Items */}
                {insights.suggested_actions && insights.suggested_actions.length > 0 && (
                  <div className="space-y-3 border-t border-brand-border pt-4">
                    <h5 className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Portfolio & Certification Actions</h5>
                    <ul className="space-y-2">
                      {insights.suggested_actions.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-[11px] text-slate-400">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 font-semibold">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <p className="text-xs">Specify target titles to compute upskilling pathways.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
