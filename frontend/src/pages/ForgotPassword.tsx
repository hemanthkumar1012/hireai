import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthLayout } from '../layouts/AuthLayout';
import { authApi } from '../services/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-extrabold text-slate-100 tracking-tight text-center mb-6">
        Recover password
      </h2>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-medium">
            Recovery instructions have been sent to your email.
          </div>
          <Link to="/login" className="block text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed text-center">
            Enter the email address associated with your account, and we will dispatch password recovery options.
          </p>

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Button type="submit" isLoading={loading} className="w-full mt-2 py-2.5 font-bold text-sm">
            Send Instructions
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Remembered your credentials?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
