import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { jobsApi } from '../../services/api';
import { Job } from '../../types';
import { JobCard } from '../../components/dashboard/JobCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setJobs(await jobsApi.saved()); }
    catch { setError('Saved jobs could not be loaded.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-sm text-rose-400">{error}</p>;
  return jobs.length ? (
    <div className="space-y-6">
      <div><h2 className="text-xl font-extrabold text-slate-100">Saved Jobs</h2><p className="text-xs text-slate-400 mt-1">Roles you bookmarked for later.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => <JobCard key={job.id} job={job} isSaved onToggleSave={async (id) => { await jobsApi.unsave(id); await load(); }} />)}
      </div>
    </div>
  ) : <EmptyState title="No saved jobs" description="Bookmark promising roles from Find Jobs to keep them here." icon={Bookmark} />;
};