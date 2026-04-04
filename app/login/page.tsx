'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@joel_ak/student-companion-lib';

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) throw new Error(result.error);

      if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      <LoginForm onSubmit={handleSubmit} errorMessage={error ?? undefined} isLoading={isLoading} />
    </div>
  );
}

export default function LoginPage() {
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

        <Suspense fallback={<div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #E2E8F0' }} />}>
          <LoginCard />
        </Suspense>

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
