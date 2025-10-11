import { Analytics, NotebookText, Share2, Tag, UploadCloud } from 'lucide-react';

const navigationItems = [
  { label: 'Notes', icon: NotebookText },
  { label: 'Tasks', icon: Share2 },
  { label: 'Tags', icon: Tag },
  { label: 'Sync', icon: UploadCloud },
  { label: 'Analytics', icon: Analytics }
];

export const LayoutSidebar = () => {
  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/40 p-6 md:block">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Modern Notes
        </span>
      </div>
      <nav className="space-y-1">
        {navigationItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
