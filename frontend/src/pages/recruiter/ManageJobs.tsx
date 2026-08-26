import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../services/api';
import { Job } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Briefcase, MapPin, Users, Edit, Globe, EyeOff, Plus } from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobsApi.listRecruiter();
        setJobs(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStatusChange = async (id: number, action: 'publish' | 'close') => {
    try {
      if (action === 'publish') await jobsApi.publish(id);
      else await jobsApi.close(id);
      
      setJobs(jobs.map(j => {
        if (j.id === id) {
          return { ...j, status: action === 'publish' ? 'PUBLISHED' : 'CLOSED', is_active: action === 'publish' };
        }
        return j;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Manage Jobs</h2>
          <p className="text-xs text-slate-400 mt-1">Create and manage your open positions</p>
        </div>
        <Button onClick={() => navigate('/recruiter/jobs/create')} className="text-xs font-bold px-5 py-2 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Post a Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState 
          title="No jobs posted yet" 
          description="Create your first job posting to start attracting top talent." 
          icon={Briefcase}
          action={<Button onClick={() => navigate('/recruiter/jobs/create')} className="mt-4">Post a Job</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="p-5 bg-brand-surface1/60">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{job.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.employment_type.replace('_', ' ')}</span>
                      <span>{job.work_mode}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'PUBLISHED' ? (
                      <Badge variant="success">Published</Badge>
                    ) : job.status === 'CLOSED' ? (
                      <Badge variant="error">Closed</Badge>
                    ) : (
                      <Badge variant="info">Draft</Badge>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium pt-0.5">
                      Updated {new Date(job.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0 border-t border-brand-border/40 md:border-t-0 md:border-l md:pl-5 pt-4 md:pt-0">
                  <Button variant="outline" onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)} className="w-full text-xs py-1.5 px-4 font-bold flex items-center justify-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit Job
                  </Button>
                  
                  {job.status !== 'PUBLISHED' ? (
                    <Button onClick={() => handleStatusChange(job.id, 'publish')} className="w-full text-xs py-1.5 px-4 font-bold flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-0">
                      <Globe className="w-3.5 h-3.5" /> Publish
                    </Button>
                  ) : (
                    <Button onClick={() => handleStatusChange(job.id, 'close')} className="w-full text-xs py-1.5 px-4 font-bold flex items-center justify-center gap-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0">
                      <EyeOff className="w-3.5 h-3.5" /> Close Job
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={() => navigate(`/recruiter/candidates?job_id=${job.id}`)} className="w-full text-xs py-1.5 px-4 font-bold flex items-center justify-center gap-1.5 mt-2">
                    View Applicants
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
