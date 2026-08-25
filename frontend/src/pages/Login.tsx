import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthLayout } from '../layouts/AuthLayout';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Role redirection
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'RECRUITER') {
        navigate('/recruiter');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-extrabold text-slate-100 tracking-tight text-center mb-6">
        Sign in to your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-450 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between text-xs font-semibold">
          <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-305">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2 py-2.5 font-bold text-xs shadow-lg">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400 font-medium">
        New to HireAI?{' '}
        <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-355">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};
