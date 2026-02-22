'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) throw new Error(result.error);

      if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
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
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

          {registered && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              Account created — you can now sign in.
            </div>
          )}

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
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-5">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
