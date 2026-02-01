import Image from 'next/image';
import HealthCheck from '../components/HealthCheck';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-12 px-8 bg-white dark:bg-black sm:items-center">
        <div className="w-full mb-8 space-y-8 flex flex-col items-center">
          <HealthCheck />
          <TaskForm />
          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-8" />
          <TaskList />
        </div>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Student Companion
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            To get started, edit the page.tsx file.
          </p>
        </div>
      </main>
    </div>
  );
}
