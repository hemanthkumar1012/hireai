import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsApi, applicationsApi } from '../../services/api';
import { Job } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MapPin, Briefcase, Clock, DollarSign, Calendar, Bookmark, CheckCircle2, Send } from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const j = await jobsApi.get(Number(id));
        setJob(j);
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    setError('');
    try {
      await applicationsApi.apply(job.id);
      setApplied(true);
      setSuccess('Application submitted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!job) return;
    try {
      if (saved) {
        await jobsApi.unsave(job.id);
        setSaved(false);
      } else {
        await jobsApi.save(job.id);
        setSaved(true);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return <div className="text-center text-slate-400 py-12 text-sm">Job not found.</div>;

  const salaryDisplay = job.min_salary && job.max_salary
    ? `${job.currency} ${job.min_salary.toLocaleString()} – ${job.max_salary.toLocaleString()}`
    : job.salary_range || 'Undisclosed';

  const expDisplay = job.experience_min != null && job.experience_max != null
    ? `${job.experience_min} – ${job.experience_max} years`
    : job.experience_min != null ? `${job.experience_min}+ years` : 'Not specified';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/30 to-brand-surface1 border border-indigo-500/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-extrabold text-slate-100">{job.title}</h1>
            <p className="text-sm text-indigo-400 font-bold mt-1">{job.company_name}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
              <Badge variant="info">{job.work_mode}</Badge>
              <Badge variant="primary">{job.employment_type.replace('_', ' ')}</Badge>
              {job.status !== 'PUBLISHED' && <Badge variant="error">{job.status}</Badge>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleSave} className={`p-2.5 border rounded-xl transition ${saved ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'border-brand-border text-slate-400 hover:text-white hover:bg-brand-surface2'}`}>
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-400' : ''}`} />
            </button>
            {applied ? (
              <Button variant="outline" className="text-xs py-2 px-5 font-bold flex items-center gap-1.5" disabled>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Applied
              </Button>
            ) : (
              <Button onClick={handleApply} isLoading={applying} className="text-xs py-2 px-5 font-bold flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 bg-brand-surface1/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Job Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
          </Card>

          {job.requirements.length > 0 && (
            <Card className="p-5 bg-brand-surface1/60 space-y-3">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Requirements</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {job.skills_needed.length > 0 && (
            <Card className="p-5 bg-brand-surface1/60 space-y-3">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_needed.map((s, i) => <Badge key={i} variant="primary">{s}</Badge>)}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 bg-brand-surface1/60 space-y-4 text-xs">
            <h3 className="font-bold text-slate-350 uppercase tracking-wider">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <div><span className="text-slate-500 font-semibold">Salary:</span> {salaryDisplay}</div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <div><span className="text-slate-500 font-semibold">Experience:</span> {expDisplay}</div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <div><span className="text-slate-500 font-semibold">Type:</span> {job.employment_type.replace('_', ' ')}</div>
              </div>
              {job.application_deadline && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <div><span className="text-slate-500 font-semibold">Deadline:</span> {new Date(job.application_deadline).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5 bg-brand-surface1/60 space-y-3 text-xs">
            <h3 className="font-bold text-slate-350 uppercase tracking-wider">About {job.company_name}</h3>
            <p className="text-slate-400 leading-relaxed">Visit the company page for more information about {job.company_name} and their open positions.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
