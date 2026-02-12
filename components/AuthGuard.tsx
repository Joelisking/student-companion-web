'use client';

import { useSession } from 'next-auth/react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Not signed in.</p>
      </div>
    );
  }

  return <>{children}</>;
}
