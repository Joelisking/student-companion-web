'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from 'student-companion-lib';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
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

          <RegisterForm onSubmit={handleSubmit} errorMessage={error ?? undefined} isLoading={isLoading} />
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
