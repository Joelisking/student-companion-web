'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { featureFlags } from '../../../lib/featureFlags';
import Link from 'next/link';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" style={{ colorScheme: 'light' }}>
        <div
          className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600"
          style={{ animation: 'spin 0.75s linear infinite' }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-slate-50" style={{ colorScheme: 'light' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-layout-font { font-family: 'DM Sans', system-ui, sans-serif; }
        .auth-layout-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>
      <nav
        className="auth-layout-font sticky top-0 z-50 flex items-center justify-between px-6 h-14 bg-white border-b border-slate-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <Link href="/" className="auth-layout-display text-lg font-semibold text-slate-800 tracking-tight no-underline">
          Student<span style={{ color: '#2563EB' }}>.</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 no-underline">
            Home
          </Link>
          <Link href="/tasks" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 no-underline">
            Tasks
          </Link>
          <Link href="/preferences" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 no-underline">
            Preferences
          </Link>
          {featureFlags.NEXT_PUBLIC_FEATURE_USER_PROFILE && (
            <Link href="/profile" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 no-underline">
              Profile
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 ml-2"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="auth-layout-font">
        {children}
      </main>
    </div>
  );
}
