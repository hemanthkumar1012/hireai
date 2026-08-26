import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsApi, authApi, companiesApi } from '../../services/api';
import { Job, Company } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Briefcase, MapPin, DollarSign, List, Save, Send, ChevronLeft } from 'lucide-react';

export const CreateJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [company, setCompany] = useState<Company | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('ONSITE');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [experienceMin, setExperienceMin] = useState('');
  const [experienceMax, setExperienceMax] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [reqsInput, setReqsInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch company
        const user = await authApi.getMe() as any;
        if (user.recruiter_profile?.company_id) {
          const comp = await companiesApi.get(user.recruiter_profile.company_id);
          setCompany(comp);
        } else if (!isEditing) {
          setError('You must create a Company Profile before posting jobs.');
        }

        // Fetch job if editing
        if (isEditing) {
          const j = await jobsApi.get(Number(id));
          setTitle(j.title);
          setDescription(j.description);
          setLocation(j.location);
          setWorkMode(j.work_mode);
          setEmploymentType(j.employment_type);
          setMinSalary(j.min_salary ? String(j.min_salary) : '');
          setMaxSalary(j.max_salary ? String(j.max_salary) : '');
          setCurrency(j.currency || 'USD');
          setExperienceMin(j.experience_min != null ? String(j.experience_min) : '');
          setExperienceMax(j.experience_max != null ? String(j.experience_max) : '');
          setSkillsInput(j.skills_needed.join(', '));
          setReqsInput(j.requirements.join('\n'));
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to initialize page');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const parseArrays = () => {
    const skills_needed = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const requirements = reqsInput.split('\n').map(r => r.trim()).filter(Boolean);
    return { skills_needed, requirements };
  };

  const handleSaveDraft = async () => {
    await submitForm('DRAFT', setSaving);
  };

  const handlePublish = async () => {
    await submitForm('PUBLISHED', setPublishing);
  };

  const submitForm = async (status: string, setLoader: (val: boolean) => void) => {
    if (!company) {
      setError('You must create a Company Profile first.');
      return;
    }
    setLoader(true);
    setError('');
    
    const { skills_needed, requirements } = parseArrays();
    const payload: Partial<Job> = {
      title, description, location,
      company_id: company.id,
      company_name: company.name,
      work_mode: workMode,
      employment_type: employmentType,
      min_salary: minSalary ? Number(minSalary) : undefined,
      max_salary: maxSalary ? Number(maxSalary) : undefined,
      currency,
      experience_min: experienceMin ? Number(experienceMin) : undefined,
      experience_max: experienceMax ? Number(experienceMax) : undefined,
      skills_needed, requirements,
      status: status as any
    };

    try {
      if (isEditing) {
        await jobsApi.update(Number(id), payload);
      } else {
        await jobsApi.create(payload);
      }
      navigate('/recruiter/jobs');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save job');
    } finally {
      setLoader(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/recruiter/jobs')} className="p-2 hover:bg-brand-surface1 rounded-lg text-slate-400 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {isEditing ? 'Edit Job Posting' : 'Create New Job'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Define the role and requirements to attract top candidates.</p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">{error}</div>}

      <div className="space-y-6">
        {/* Basic Details */}
        <Card className="p-6 bg-brand-surface1/60 space-y-5">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <Briefcase className="w-4 h-4" /> Basic Details
          </h3>
          <Input label="Job Title *" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and team..." rows={6}
              className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input label="Location *" value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Work Mode</label>
              <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition">
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Employment Type</label>
              <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition">
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-6 bg-brand-surface1/60 space-y-5">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <List className="w-4 h-4" /> Requirements & Skills
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Min Experience (Years)" type="number" value={experienceMin} onChange={e => setExperienceMin(e.target.value)} placeholder="e.g. 3" />
            <Input label="Max Experience (Years)" type="number" value={experienceMax} onChange={e => setExperienceMax(e.target.value)} placeholder="e.g. 7" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Skills (Comma separated)</label>
            <Input value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Node.js" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Key Requirements (One per line)</label>
            <textarea value={reqsInput} onChange={e => setReqsInput(e.target.value)} placeholder="- Bachelor's degree in CS&#10;- Experience with microservices..." rows={4}
              className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </Card>

        {/* Compensation */}
        <Card className="p-6 bg-brand-surface1/60 space-y-5">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <DollarSign className="w-4 h-4" /> Compensation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input label="Min Salary" type="number" value={minSalary} onChange={e => setMinSalary(e.target.value)} placeholder="80000" />
            <Input label="Max Salary" type="number" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} placeholder="120000" />
            <Input label="Currency" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="USD" />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleSaveDraft} isLoading={saving} disabled={publishing} className="text-xs font-bold px-6 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save as Draft
          </Button>
          <Button onClick={handlePublish} isLoading={publishing} disabled={saving} className="text-xs font-bold px-6 flex items-center gap-2">
            <Send className="w-4 h-4" /> {isEditing ? 'Update & Publish' : 'Publish Job'}
          </Button>
        </div>
      </div>
    </div>
  );
};
