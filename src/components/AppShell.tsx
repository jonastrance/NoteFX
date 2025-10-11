import { PropsWithChildren } from 'react';
import { LayoutHeader } from './LayoutHeader';
import { LayoutSidebar } from './LayoutSidebar';

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <LayoutSidebar />
      <div className="flex flex-1 flex-col">
        <LayoutHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children ?? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-primary/10">
              <h1 className="text-3xl font-semibold tracking-tight">Modern Notes App</h1>
              <p className="mt-4 text-slate-300">
                Kickstart your productivity with tasks, AI-powered tagging, and privacy-first syncing.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
