'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      style={{ colorScheme: 'light' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-font { font-family: 'DM Sans', system-ui, sans-serif; }
        .auth-display { font-family: 'Fraunces', Georgia, serif; }
        .auth-input:focus { outline: none; border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .auth-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .auth-btn { transition: background 0.15s, transform 0.1s; }
        .auth-btn:hover:not(:disabled) { background: #1D4ED8; }
        .auth-btn:active:not(:disabled) { transform: scale(0.99); }
        .fade-in { animation: fadeIn 0.4s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="fade-in auth-font w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="auth-display text-2xl font-semibold text-slate-800">
            Student<span style={{ color: '#2563EB' }}>.</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #E2E8F0' }}
        >
          <h1 className="auth-display text-2xl font-semibold text-slate-800 mb-1">
            Create an account
          </h1>
          <p className="text-slate-400 text-sm mb-6">Start organising your studies</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                className="auth-input w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 bg-white"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                className="auth-input w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 bg-white"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="auth-input w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 bg-white"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-btn mt-1 w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: '#2563EB' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-5">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
