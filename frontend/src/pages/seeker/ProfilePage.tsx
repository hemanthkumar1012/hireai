import React, { useState, useEffect } from 'react';
import { profilesApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { JobSeekerProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { User as UserIcon, MapPin, Briefcase, Globe, Github, Linkedin, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { state } = useAuth();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form fields
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExp, setYearsExp] = useState<number | ''>('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [preferredJobType, setPreferredJobType] = useState('');
  const [preferredWorkMode, setPreferredWorkMode] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const p = await profilesApi.getMyProfile();
        setProfile(p);
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setPhone(p.phone || '');
        setLocation(p.location || '');
        setYearsExp(p.years_of_experience ?? '');
        setCurrentCompany(p.current_company || '');
        setCurrentRole(p.current_role || '');
        setExpectedSalary(p.expected_salary || '');
        setPreferredJobType(p.preferred_job_type || '');
        setPreferredWorkMode(p.preferred_work_mode || '');
        setPortfolioUrl(p.portfolio_url || '');
        setLinkedinUrl(p.linkedin_url || '');
        setGithubUrl(p.github_url || '');
        setSkillsInput((p.skills || []).join(', '));
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const updated = await profilesApi.updateMyProfile({
        headline, bio, phone, location,
        years_of_experience: yearsExp === '' ? undefined : Number(yearsExp),
        current_company: currentCompany, current_role: currentRole,
        expected_salary: expectedSalary,
        preferred_job_type: preferredJobType, preferred_work_mode: preferredWorkMode,
        portfolio_url: portfolioUrl, linkedin_url: linkedinUrl, github_url: githubUrl,
        skills,
      });
      setProfile(updated);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Compute profile completion
  const fields = [headline, bio, phone, location, currentRole, skillsInput, linkedinUrl];
  const filled = fields.filter(f => f && f.trim()).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">My Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Manage your professional information</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Profile Completion</span>
          <span className={`text-sm font-extrabold ${completion >= 80 ? 'text-emerald-400' : completion >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{completion}%</span>
        </div>
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
        {/* Personal Info */}
        <Card className="p-5 bg-brand-surface1/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2">
            <UserIcon className="w-3.5 h-3.5" /> Personal Information
          </h3>
          <Input label="Professional Headline" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" />
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A brief professional summary..." rows={3}
              className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555-0123" />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>
        </Card>

        {/* Experience */}
        <Card className="p-5 bg-brand-surface1/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" /> Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Current Company" value={currentCompany} onChange={e => setCurrentCompany(e.target.value)} placeholder="Acme Inc." />
            <Input label="Current Role" value={currentRole} onChange={e => setCurrentRole(e.target.value)} placeholder="Senior Engineer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Years of Experience" type="number" value={String(yearsExp)} onChange={e => setYearsExp(e.target.value ? Number(e.target.value) : '')} placeholder="5" />
            <Input label="Expected Salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} placeholder="$120,000" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Preferred Work Mode</label>
              <select value={preferredWorkMode} onChange={e => setPreferredWorkMode(e.target.value)}
                className="w-full bg-brand-surface2 border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 outline-none">
                <option value="">Select...</option>
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">On-site</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-5 bg-brand-surface1/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Skills</h3>
          <Input label="Skills (comma-separated)" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="Python, React, PostgreSQL, Docker" />
          {skillsInput && (
            <div className="flex flex-wrap gap-1.5">
              {skillsInput.split(',').map((s, i) => s.trim() && <Badge key={i} variant="primary">{s.trim()}</Badge>)}
            </div>
          )}
        </Card>

        {/* Links */}
        <Card className="p-5 bg-brand-surface1/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Portfolio URL" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://yoursite.com" />
            <Input label="LinkedIn URL" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/you" />
            <Input label="GitHub URL" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/you" />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} className="px-6 py-2.5 font-bold text-xs flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
