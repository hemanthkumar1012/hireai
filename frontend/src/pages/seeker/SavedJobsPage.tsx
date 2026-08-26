import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsApi, jobsApi } from '../../services/api';
import { Job } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, MapPin, Briefcase, X } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const jobs = await applicationsApi.savedJobs();
        setSavedJobs(jobs);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleUnsave = async (jobId: number) => {
    try {
      await jobsApi.unsave(jobId);
      setSavedJobs(savedJobs.filter(j => j.id !== jobId));
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-indigo-400" /> Saved Jobs
        </h2>
        <p className="text-xs text-slate-400 mt-1">{savedJobs.length} saved position{savedJobs.length !== 1 ? 's' : ''}</p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState title="No saved jobs" description="Browse jobs and save the ones you're interested in." icon={Bookmark} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map(job => (
            <Card key={job.id} hoverEffect className="p-5 bg-brand-surface1/60 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{job.title}</h4>
                    <p className="text-indigo-400 font-semibold mt-0.5">{job.company_name}</p>
                  </div>
                  <button onClick={() => handleUnsave(job.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-[10px] text-slate-450 font-semibold">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <Badge variant="info">{job.work_mode}</Badge>
                  <Badge variant="primary">{job.employment_type}</Badge>
                </div>
                {job.skills_needed.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills_needed.slice(0, 4).map((s, i) => <Badge key={i} variant="success">{s}</Badge>)}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/40">
                <Button onClick={() => navigate(`/jobs/${job.id}`)} variant="outline" className="w-full text-[10px] py-1.5 font-bold">
                  View & Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
