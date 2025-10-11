import { BarChart3, TrendingUp } from 'lucide-react';
import type { TagStats } from '../context/TagStoreProvider';

const StatBlock = ({ label, value, footnote }: { label: string; value: string; footnote?: string }) => (
  <div className="rounded-lg border border-white/5 bg-slate-950/40 p-4">
    <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {footnote && <p className="mt-1 text-xs text-slate-500">{footnote}</p>}
  </div>
);

type TagAnalyticsProps = {
  stats: TagStats;
};

export const TagAnalytics = ({ stats }: TagAnalyticsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <BarChart3 className="h-5 w-5 text-sky-300" aria-hidden />
          Tag analytics
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatBlock label="Total tags" value={stats.totalTags.toString()} />
        <StatBlock
          label="Hierarchy depth"
          value={`${stats.hierarchyDepth}`}
          footnote="Maximum levels of parent → child relationships"
        />
        <StatBlock
          label="AI acceptance"
          value={`${stats.feedbackAcceptanceRate}%`}
          footnote="Based on feedback signals"
        />
      </div>
      <div className="rounded-lg border border-white/5 bg-slate-950/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
          <TrendingUp className="h-4 w-4 text-emerald-300" aria-hidden />
          Most used tags
        </div>
        <ul className="mt-3 space-y-2">
          {stats.topTags.map((tag) => (
            <li key={tag.id} className="flex items-center justify-between text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                <span>{tag.name}</span>
              </div>
              <span className="text-xs text-slate-400">{tag.usageCount} uses</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
