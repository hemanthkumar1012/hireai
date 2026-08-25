import React, { useState, useEffect } from 'react';
import { profilesApi } from '../../services/api';
import { JobSeekerProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Cpu, CheckCircle2, AlertCircle, FileText, Sparkles, BookOpen, Award, Target, Trophy } from 'lucide-react';

export const ResumeIntelligence: React.FC = () => {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await profilesApi.getMyProfile();
      setProfile(res);
      if (res.resume_text) {
        setResumeText(res.resume_text);
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

  const handleParseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setParsing(true);
    setAlert(null);
    try {
      const updatedProfile = await profilesApi.parseResume(resumeText);
      setProfile(updatedProfile);
      setAlert({ type: 'success', text: 'Resume intelligence parsed successfully! Tech stack and work history loaded.' });
    } catch (err: any) {
      setAlert({ type: 'error', text: 'Failed to trigger resume intelligence parsing.' });
    } finally {
      setParsing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Calculate simulated ATS score based on number of parsed skills (10 points per skill, max 100)
  const skillCount = profile?.skills?.length || 0;
  const atsScore = Math.min(100, Math.max(30, skillCount * 10));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">AI Resume Intelligence</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Upload or paste your CV text to automatically extract tech stacks, milestones, and career objectives.</p>
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

      {/* Profile ATS Score & Details Overview */}
      {profile?.resume_text && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center justify-between bg-gradient-to-r from-indigo-950/20 to-brand-surface1 border-indigo-500/10">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">ATS Readiness Score</p>
              <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">{atsScore}%</h3>
            </div>
            <Trophy className="w-8 h-8 text-indigo-500/60" />
          </Card>
          
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Extracted Tech Stack</p>
              <h3 className="text-2xl font-extrabold text-slate-200 mt-1">{skillCount} skills</h3>
            </div>
            <Cpu className="w-8 h-8 text-slate-650" />
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Historical Milestones</p>
              <h3 className="text-2xl font-extrabold text-slate-200 mt-1">{profile.work_history?.length || 0} jobs</h3>
            </div>
            <Award className="w-8 h-8 text-slate-650" />
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Paste Resume Text Area */}
        <div className="lg:col-span-6">
          <Card className="space-y-4 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <FileText className="w-4 h-4 text-indigo-400" />
              Paste Raw Resume Details
            </h3>
            <form onSubmit={handleParseSubmit} className="space-y-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste full resume contents here (include experience, education, and skills)..."
                rows={14}
                className="w-full p-4 bg-brand-surface2/60 border border-brand-border rounded-2xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
                required
              />
              <Button type="submit" isLoading={parsing} className="w-full font-bold py-2.5 text-xs shadow-lg">
                Extract Skills & Milestones
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Render Extracted Details */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="space-y-5 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Parsed Profile State
            </h3>

            {profile?.resume_text ? (
              <div className="space-y-5 text-xs">
                {/* Symmetrical ATS score bar indicator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>ATS Benchmark</span>
                    <span className="text-indigo-400">{atsScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-250 mb-1.5 uppercase tracking-wide text-[9px]">Extracted Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, i) => (
                      <Badge key={i} variant="primary" className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5">{s}</Badge>
                    ))}
                  </div>
                </div>

                {profile.work_history && profile.work_history.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-250 mb-2.5 uppercase tracking-wide text-[9px]">Parsed Work History</h4>
                    <div className="space-y-3">
                      {profile.work_history.map((job, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500/20 pl-3.5 space-y-1">
                          <p className="font-bold text-slate-300">{job.role}</p>
                          <p className="text-[10px] text-indigo-400 font-semibold">{job.company} • {job.duration}</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed">{job.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.education && profile.education.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-250 mb-2.5 uppercase tracking-wide text-[9px]">Parsed Education</h4>
                    <div className="space-y-2">
                      {profile.education.map((edu, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500/20 pl-3.5">
                          <p className="font-bold text-slate-300">{edu.degree} in {edu.field_of_study}</p>
                          <p className="text-[10px] text-indigo-400 font-semibold">{edu.school} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 font-semibold">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <p className="text-xs">Submit raw text to see structured extraction results.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
