import { Menu, Search } from 'lucide-react';

export const LayoutHeader = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:border-primary/40 hover:text-primary"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
        <div>
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="text-sm text-slate-400">Plan, capture, and analyze your ideas seamlessly.</p>
        </div>
      </div>
      <div className="relative w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="Search notes, tasks, tags..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </header>
  );
};
