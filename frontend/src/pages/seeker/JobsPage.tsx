import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../services/api';
import { Job, PaginatedJobs } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, MapPin, Briefcase, Filter, ArrowRight, Bookmark } from 'lucide-react';

export const JobsPage: React.FC = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedJobs | null>(null);
=======
  const [jobs, setJobs] = useState<Job[]>([]);
  const [seekerApps, setSeekerApps] = useState<Application[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchJobs = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      const result = await jobsApi.search({
        search: searchTerm || undefined,
        location: location || undefined,
        work_mode: workMode || undefined,
        employment_type: employmentType || undefined,
        salary_min: minSalary ? Number(minSalary) : undefined,
        page,
        page_size: pageSize
      });
      setData(result);
=======
      const [jobsRes, appsRes, savedRes] = await Promise.all([
        jobsApi.list(search),
        applicationsApi.listSeeker(),
        jobsApi.saved()
      ]);
      setJobs(jobsRes);
      setSeekerApps(appsRes);
      setSavedJobIds(new Set(savedRes.map((job) => job.id)));
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
    } catch (err) {
      console.error('Failed to fetch jobs', err);
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
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setWorkMode('');
    setEmploymentType('');
    setMinSalary('');
    setPage(1);
    fetchJobs();
  };

  const handleSave = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await jobsApi.save(jobId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Find Jobs</h2>
        <p className="text-xs text-slate-400 mt-1">Discover your next career opportunity</p>
=======
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
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
      </div>

      {/* Search and Filters */}
      <Card className="p-5 bg-brand-surface1/80 border border-brand-border/50">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full bg-brand-surface2 border border-brand-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Location..."
                className="w-full bg-brand-surface2 border border-brand-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <Button type="submit" className="text-xs font-bold px-6 py-2 shrink-0">Search</Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-brand-border/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filters:
            </span>
            <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="bg-brand-surface2 border border-brand-border rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none">
              <option value="">Any Work Mode</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
            <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className="bg-brand-surface2 border border-brand-border rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none">
              <option value="">Any Job Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <input
              type="number"
              value={minSalary}
              onChange={e => setMinSalary(e.target.value)}
              placeholder="Min Salary ($)"
              className="w-32 bg-brand-surface2 border border-brand-border rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
            />
            {(searchTerm || location || workMode || employmentType || minSalary) && (
              <button type="button" onClick={clearFilters} className="text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition">
                Clear all
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
<<<<<<< HEAD
      ) : data?.jobs.length === 0 ? (
        <EmptyState title="No jobs found" description="Try adjusting your search or filters to find more opportunities." icon={Briefcase} />
=======
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
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
      ) : (
        <div className="space-y-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Showing {data?.jobs.length} of {data?.total} result{data?.total !== 1 && 's'}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {data?.jobs.map(job => (
              <Card 
                key={job.id} 
                hoverEffect 
                className="p-5 bg-brand-surface1/60 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition">{job.title}</h3>
                      <p className="text-xs text-indigo-400/80 font-semibold">{job.company_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <Badge variant="info">{job.work_mode}</Badge>
                    <Badge variant="primary">{job.employment_type.replace('_', ' ')}</Badge>
                    {job.salary_range && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold">{job.salary_range}</span>}
                  </div>
                  
                  {job.skills_needed && job.skills_needed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills_needed.slice(0, 5).map((skill, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border border-brand-border text-slate-300 bg-brand-surface2">
                          {skill}
                        </span>
                      ))}
                      {job.skills_needed.length > 5 && <span className="text-[9px] text-slate-500 px-1">+{job.skills_needed.length - 5}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0">
                  <Button variant="outline" onClick={(e) => handleSave(job.id, e)} className="p-2 h-auto text-slate-400 hover:text-white group">
                    <Bookmark className="w-4 h-4 group-hover:fill-current" />
                  </Button>
                  <Button className="text-xs py-1.5 px-4 font-bold flex items-center gap-1">
                    Apply <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-brand-border/40">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="text-xs py-1 px-3"
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-slate-400">
                Page {page} of {data.total_pages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(data.total_pages, p + 1))} 
                disabled={page === data.total_pages}
                className="text-xs py-1 px-3"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
