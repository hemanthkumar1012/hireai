import React, { useState, useEffect } from 'react';
import { jobsApi } from '../../services/api';
import { Job } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Briefcase, Trash2, Plus, X } from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [requirements, setRequirements] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await jobsApi.list();
      setJobs(res);
    } catch (err) {
      console.error("Failed to load jobs list.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setAlert(null);
    try {
      const skillsArray = skillsNeeded.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const reqsArray = requirements.split(',').map(r => r.trim()).filter(r => r.length > 0);

      await jobsApi.create({
        title,
        company_name: companyName,
        location,
        salary_range: salaryRange,
        description,
        skills_needed: skillsArray,
        requirements: reqsArray,
      });

      setAlert({ type: 'success', text: 'Job campaign posted successfully!' });
      
      // Reset form
      setTitle('');
      setCompanyName('');
      setLocation('');
      setSalaryRange('');
      setDescription('');
      setSkillsNeeded('');
      setRequirements('');

      // Refresh list
      fetchJobs();
    } catch (err: any) {
      setAlert({ type: 'error', text: 'Failed to create job posting.' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await jobsApi.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
      setAlert({ type: 'success', text: 'Job campaign deleted.' });
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to delete job posting.' });
    }
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const updated = await jobsApi.update(job.id, { is_active: !job.is_active });
      setJobs(jobs.map(j => j.id === job.id ? updated : j));
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update job status.' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Manage Job Campaigns</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure active vacancies, requirements, salary structures, and skills vectors.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Create Job Form */}
        <div className="lg:col-span-5">
          <Card className="space-y-4 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Plus className="w-4 h-4 text-indigo-400" />
              Post Job Opening
            </h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                label="Job Title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Python Developer"
              />

              <Input
                label="Company Name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. ByteScale Solutions"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote / NYC"
                />
                <Input
                  label="Salary Range"
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $120k - $140k"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 font-sans">
                  Job Description & Context
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize day-to-day duties..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-brand-surface2/60 border border-brand-border rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5 font-sans">
                  Skills Needed (comma separated)
                </label>
                <textarea
                  value={skillsNeeded}
                  onChange={(e) => setSkillsNeeded(e.target.value)}
                  placeholder="e.g. Python, FastAPI, Docker"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-brand-surface2/60 border border-brand-border rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5 font-sans">
                  Job Requirements (comma separated)
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. 3+ years experience, CS degree"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-brand-surface2/60 border border-brand-border rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
                  required
                />
              </div>

              <Button type="submit" isLoading={creating} className="w-full font-bold py-2.5 text-xs shadow-lg">
                Publish Campaign
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Jobs List */}
        <div className="lg:col-span-7">
          <Card className="space-y-4 bg-brand-surface1/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Active campaigns ({jobs.length})
            </h3>

            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-brand-border bg-brand-surface2/60 p-4.5 rounded-2xl space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-205">{job.title}</h4>
                        <p className="text-[10px] text-slate-450 font-bold mt-1 uppercase tracking-wider">{job.company_name} • {job.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(job)}
                          className={`px-3 py-1 text-[9px] font-bold rounded-lg border transition duration-200 ${
                            job.is_active
                              ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/10'
                              : 'bg-slate-700/5 border-slate-600/15 text-slate-400 hover:bg-slate-700/10'
                          }`}
                        >
                          {job.is_active ? 'Active' : 'Closed'}
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 bg-red-500/5 border border-red-500/15 text-red-400 hover:bg-red-500/15 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-brand-border/40">
                      {job.skills_needed.map((skill, index) => (
                        <Badge key={index} variant="primary" className="text-[8px]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 font-semibold">
                <Briefcase className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <p className="text-xs">No active postings yet.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
