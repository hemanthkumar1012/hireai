import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthLayout } from '../layouts/AuthLayout';
import {
  Cpu,
  Briefcase,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'JOB_SEEKER' | 'RECRUITER'>(
    'JOB_SEEKER'
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) {
      return {
        label: 'Empty',
        color: 'bg-slate-800',
        width: 'w-0',
      };
    }

    if (password.length < 8) {
      return {
        label: 'Weak',
        color: 'bg-red-500',
        width: 'w-1/3',
      };
    }

    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (
      password.length >= 10 &&
      hasNumber &&
      hasUpper &&
      hasSpecial
    ) {
      return {
        label: 'Strong',
        color: 'bg-emerald-500',
        width: 'w-full',
      };
    }

    return {
      label: 'Moderate',
      color: 'bg-amber-500',
      width: 'w-2/3',
    };
  };

  const strength = getPasswordStrength();

  const handleNextStep = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStep(2);
  };

  const getRegistrationError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail;

      if (typeof detail === 'string' && detail.trim()) {
        return detail;
      }

      if (
        Array.isArray(detail) &&
        detail.length > 0 &&
        typeof detail[0]?.msg === 'string'
      ) {
        return detail[0].msg;
      }

      if (err.response?.status === 429) {
        return 'Too many registration attempts. Please wait a minute and try again.';
      }

      if (err.response?.status === 500) {
        return 'The server could not create the account. Please try again in a moment.';
      }

      if (!err.response) {
        return 'Unable to reach the ApplyRight server. Please check your internet connection and try again.';
      }
    }

    if (err instanceof Error && err.message) {
      return err.message;
    }

    return 'Unable to create the account. Please try again.';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedFirstName || !trimmedLastName) {
      setError('Please enter your first and last name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password.length > 128) {
      setError('Password must be 128 characters or fewer.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        trimmedEmail,
        password,
        trimmedFirstName,
        trimmedLastName,
        role
      );

      if (user.role === 'RECRUITER') {
        navigate('/recruiter');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(getRegistrationError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-extrabold text-slate-100 tracking-tight text-center mb-6">
        Create your ApplyRight account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium leading-relaxed">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form
          onSubmit={handleNextStep}
          className="space-y-4"
        >
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Step 1: Choose account type
          </label>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                setRole('JOB_SEEKER');
                setError('');
              }}
              className={`p-4 text-left rounded-xl border transition-all duration-300 flex items-center justify-between ${
                role === 'JOB_SEEKER'
                  ? 'bg-indigo-500/5 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5'
                  : 'bg-brand-surface2 border-brand-border text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 shrink-0" />

                <div>
                  <p className="text-xs font-bold">
                    Job Seeker
                  </p>

                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Apply for jobs and review career upskilling paths
                  </p>
                </div>
              </div>

              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  role === 'JOB_SEEKER'
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-slate-700'
                }`}
              >
                {role === 'JOB_SEEKER' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('RECRUITER');
                setError('');
              }}
              className={`p-4 text-left rounded-xl border transition-all duration-300 flex items-center justify-between ${
                role === 'RECRUITER'
                  ? 'bg-indigo-500/5 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5'
                  : 'bg-brand-surface2 border-brand-border text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 shrink-0" />

                <div>
                  <p className="text-xs font-bold">
                    Recruiter
                  </p>

                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Post openings and rank applicants semantically
                  </p>
                </div>
              </div>

              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  role === 'RECRUITER'
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-slate-700'
                }`}
              >
                {role === 'RECRUITER' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </span>
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Step 2: Enter Details
            </span>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError('');
              }}
              className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Role selection
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="John"
            />

            <Input
              label="Last Name"
              type="text"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />

          {password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <span>
                  Strength: {strength.label}
                </span>

                <span>
                  {password.length}/128
                </span>
              </div>

              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`}
                />
              </div>
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="••••••••"
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full mt-4 py-2.5 font-bold text-xs shadow-lg"
          >
            Create Account
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-slate-400 font-medium">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-400 hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
