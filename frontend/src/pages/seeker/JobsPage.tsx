import React, { useState, useEffect } from 'react';
import { jobsApi, applicationsApi } from '../../services/api';
import { Job, Application } from '../../types';
import { JobCard } from '../../components/dashboard/JobCard';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, Briefcase } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [seekerApps, setSeekerApps] = useState<Application[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchJobsAndApps = async (search?: string) => {
    try {
      const [jobsRes, appsRes, savedRes] = await Promise.all([
        jobsApi.list(search),
        applicationsApi.listSeeker(),
        jobsApi.saved()
      ]);
      setJobs(jobsRes);
      setSeekerApps(appsRes);
      setSavedJobIds(new Set(savedRes.map((job) => job.id)));
    } catch (err) {
      console.error("Failed to load jobs listings.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (jobId: number) => {
    const saved = savedJobIds.has(jobId);
    try {
      if (saved) await jobsApi.unsave(jobId); else await jobsApi.save(jobId);
      setSavedJobIds((current) => {
        const next = new Set(current);
        if (saved) next.delete(jobId); else next.add(jobId);
        return next;
      });
    } catch (err: any) {
      setAlert({ type: 'error', text: err.response?.data?.detail || 'Unable to update saved jobs.' });
    }
  };

  useEffect(() => {
    fetchJobsAndApps();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchJobsAndApps(searchQuery);
  };

  const handleApply = async (jobId: number) => {
    setApplyingJobId(jobId);
    setAlert(null);
    try {
      await applicationsApi.apply(jobId);
      setAlert({ type: 'success', text: 'Application submitted! AI matching score has been evaluated.' });
      
      // refresh seeker applications
      const appsRes = await applicationsApi.listSeeker();
      setSeekerApps(appsRes);
    } catch (err: any) {
      setAlert({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to submit application. Ensure your CV text is parsed first.'
      });
    } finally {
      setApplyingJobId(null);
    }
  };

  const hasUserApplied = (jobId: number) => {
    return seekerApps.some(app => app.job_id === jobId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Explore Opportunities</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Review live roles matching your skills, complete with instant AI fit scores.</p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
            <input
              aria-label="Search jobs"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, tech, company..."
              className="w-full pl-9 pr-3 py-2 bg-brand-surface1 border border-brand-border rounded-xl text-xs text-slate-250 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-surface2 border border-brand-border text-xs font-bold rounded-xl hover:bg-brand-surface1 hover:border-slate-700 transition"
          >
            Find
          </button>
        </form>
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

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              isApplying={applyingJobId === job.id}
              hasApplied={hasUserApplied(job.id)}
              isSaved={savedJobIds.has(job.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try broadening your search term or check back later for newly added vacancies."
          icon={Briefcase}
        />
      )}
    </div>
  );
};
