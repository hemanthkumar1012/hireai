import React, { useState, useEffect } from 'react';
import { companiesApi, authApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Company, User } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Building2, Globe, Users, Save, CheckCircle2 } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { state } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [founded, setFounded] = useState<number | ''>('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Find company by checking current user's recruiter_profile -> company_id
        // We'll just try to fetch /auth/me which should ideally return recruiter_profile details, 
        // or we can just fetch jobs to see company, but let's assume we can fetch it if we know the ID.
        // For simplicity in this mockup, we'll try to find a company by name or just allow creation.
        // Let's get current user to see if they have a company linked.
        const user = await authApi.getMe() as any; 
        if (user.recruiter_profile?.company_id) {
          const comp = await companiesApi.get(user.recruiter_profile.company_id);
          setCompany(comp);
          setName(comp.name);
          setWebsite(comp.website || '');
          setIndustry(comp.industry || '');
          setLocation(comp.location || '');
          setSize(comp.company_size || '');
          setDescription(comp.description || '');
          setFounded(comp.founded_year || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    const payload = {
      name, website, industry, location,
      company_size: size,
      description,
      founded_year: founded ? Number(founded) : undefined
    };

    try {
      let savedComp;
      if (company) {
        savedComp = await companiesApi.update(company.id, payload);
      } else {
        savedComp = await companiesApi.create(payload);
      }
      setCompany(savedComp);
      setSuccess('Company profile saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-400" /> Company Profile
        </h2>
        <p className="text-xs text-slate-400 mt-1">Manage your organization's details shown to candidates.</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 bg-brand-surface1/60 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Company Name *" value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp" required />
            <Input label="Website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://acme.com" />
            <Input label="Industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Technology" />
            <Input label="Location (Headquarters)" value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Company Size
              </label>
              <select value={size} onChange={e => setSize(e.target.value)}
                className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition">
                <option value="">Select size...</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            <Input label="Founded Year" type="number" value={String(founded)} onChange={e => setFounded(e.target.value ? Number(e.target.value) : '')} placeholder="2020" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">About the Company</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell candidates about your company's mission, culture, and what you do..." rows={5}
              className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} className="px-8 py-2.5 font-bold text-xs flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Company
          </Button>
        </div>
      </form>
    </div>
  );
};
