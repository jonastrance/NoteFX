import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import {
  AnalyticsData,
  DateRangePreset,
  ProductivityInsight
} from '../types/analytics';
import { getPresetRange, formatDate } from '../utils/date';
import { useAnalytics } from '../hooks/useAnalytics';
import { useProductivityMetrics } from '../hooks/useProductivityMetrics';
import { useUsageStats } from '../hooks/useUsageStats';
import { prepareCsvData, prepareJsonData } from '../utils/analytics';

const COLORS = ['#4F46E5', '#22D3EE', '#F97316', '#14B8A6', '#8B5CF6'];

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const InsightBadge: React.FC<{ insight: ProductivityInsight }> = ({ insight }) => {
  const colorMap = {
    positive: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-500/10 text-amber-200 border-amber-500/40',
    info: 'bg-sky-500/10 text-sky-200 border-sky-500/40'
  };
  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-1 ${colorMap[insight.severity]}`}>
      <span className="text-sm uppercase tracking-wide font-semibold">{insight.title}</span>
      <p className="text-sm text-slate-200/80 leading-relaxed">{insight.description}</p>
    </div>
  );
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const preset: DateRangePreset = '30d';
    const presetRange = getPresetRange(preset);
    return { preset, ...presetRange };
  });
  const [trendView, setTrendView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { raw, currentRangeData, noteFrequency, taskMetrics, focusMetrics, tagUsage, noteStats, trendData, goalProgress, comparison, insights } = useAnalytics(
    data,
    {
      dateRange,
      analyticsEnabled,
      trendView
    }
  );

  const productivity = useProductivityMetrics({
    notes: currentRangeData.notes,
    tasks: currentRangeData.tasks,
    focusSessions: currentRangeData.focusSessions,
    focusMetrics,
    taskMetrics,
    dateRange
  });

  const usageStats = useUsageStats({
    notes: currentRangeData.notes,
    focusSessions: currentRangeData.focusSessions,
    noteFrequency,
    focusMetrics,
    taskMetrics,
    tagUsage
  });

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setDateRange((prev) => ({ ...prev, preset }));
      return;
    }
    const { start, end } = getPresetRange(preset);
    setDateRange({ preset, start, end });
  };

  const handleCustomChange = (field: 'start' | 'end', value: string) => {
    setDateRange((prev) => ({
      ...prev,
      preset: 'custom',
      [field]: value ? new Date(value) : prev[field]
    }));
  };

  const exportFile = (format: 'csv' | 'json') => {
    const blob = new Blob(
      [
        format === 'csv'
          ? prepareCsvData(raw.notes, raw.tasks, raw.focusSessions)
          : prepareJsonData(raw.notes, raw.tasks, raw.focusSessions, raw.goals)
      ],
      { type: format === 'csv' ? 'text/csv' : 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${format}-${new Date().toISOString()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const analyticsNotice = useMemo(() => {
    if (analyticsEnabled) return null;
    return (
      <div className="card border-primary/40 text-slate-200">
        <h3 className="card-heading">Analytics disabled</h3>
        <p className="text-sm text-slate-300/80">
          Analytics are processed privately on your device. Toggle the switch above to opt-in and view insights. No data
          leaves your browser.
        </p>
      </div>
    );
  }, [analyticsEnabled]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-300 max-w-2xl">
            Gain visibility into your note-taking habits, focus time, and productivity trends. All analytics are computed
            on-device with optional opt-in.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">Privacy-first analytics</span>
          <button
            type="button"
            onClick={() => setAnalyticsEnabled((prev) => !prev)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full border border-slate-700 transition-colors duration-300 ${
              analyticsEnabled ? 'bg-primary border-primary-dark' : 'bg-slate-800'
            }`}
            aria-pressed={analyticsEnabled}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                analyticsEnabled ? 'translate-x-8' : 'translate-x-2'
              }`}
            />
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <h3 className="card-heading">Productivity Score</h3>
          <p className="metric-value">{productivity.productivityScore}</p>
          <p className="metric-subtext">Composite score based on focus, note creation, and task completion</p>
        </div>
        <div className="card">
          <h3 className="card-heading">Focus Minutes</h3>
          <p className="metric-value">{focusMetrics.totalMinutes}</p>
          <p className="metric-subtext">{productivity.averageDailyFocusMinutes} min avg per day</p>
        </div>
        <div className="card">
          <h3 className="card-heading">Task Completion</h3>
          <p className="metric-value">{taskMetrics.completionRate}%</p>
          <p className="metric-subtext">{taskMetrics.completed} of {taskMetrics.total} tasks completed</p>
        </div>
        <div className="card">
          <h3 className="card-heading">Current Streak</h3>
          <p className="metric-value">{productivity.streak.current} days</p>
          <p className="metric-subtext">Longest streak: {productivity.streak.longest} days</p>
        </div>
      </section>

      <section className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="card-heading mb-1">Filters</h2>
            <p className="text-sm text-slate-300">
              Explore trends over custom time ranges and compare against previous periods.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={dateRange.preset}
              onChange={(event) => handlePresetChange(event.target.value as DateRangePreset)}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last 12 months</option>
              <option value="custom">Custom range</option>
            </select>
            {dateRange.preset === 'custom' && (
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <label className="flex items-center gap-2">
                  <span>Start</span>
                  <input
                    type="date"
                    value={formatDate(dateRange.start)}
                    onChange={(event) => handleCustomChange('start', event.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>End</span>
                  <input
                    type="date"
                    value={formatDate(dateRange.end)}
                    onChange={(event) => handleCustomChange('end', event.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1"
                  />
                </label>
              </div>
            )}
            <select
              value={trendView}
              onChange={(event) => setTrendView(event.target.value as typeof trendView)}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="daily">Daily view</option>
              <option value="weekly">Weekly view</option>
              <option value="monthly">Monthly view</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => exportFile('csv')}
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm hover:border-primary"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportFile('json')}
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm hover:border-primary"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </section>

      {analyticsNotice}

      {analyticsEnabled && (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <h3 className="card-heading">Note Creation Frequency</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={noteFrequency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' }} />
                    <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="card-heading">Task Completion Rate</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={[{ name: 'Completed', value: taskMetrics.completed }, { name: 'Pending', value: taskMetrics.pending }]} innerRadius={60} outerRadius={80} paddingAngle={5}>
                      {[0, 1].map((index) => (
                        <Cell key={index} fill={index === 0 ? '#22D3EE' : '#F97316'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="card">
              <h3 className="card-heading">Focus Time Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' }} />
                    <Area type="monotone" dataKey="focusMinutes" stroke="#22D3EE" fill="url(#focusGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="card-heading">Tag Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tagUsage.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="tag" type="category" stroke="#94a3b8" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {tagUsage.slice(0, 6).map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="card-heading">Productivity Comparison</h3>
              <div className="space-y-3">
                {comparison.map((item) => (
                  <div key={item.metric} className="rounded-xl bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.metric}</span>
                      <span className={`font-semibold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercentage}%)
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Current: {item.currentValue}</span>
                      <span>Previous: {item.previousValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="card">
              <h3 className="card-heading">Note Length & Reading Time</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Average words: {noteStats.averageWordCount}</li>
                <li>Median words: {noteStats.medianWordCount}</li>
                <li>Shortest note: {noteStats.minWordCount} words</li>
                <li>Longest note: {noteStats.maxWordCount} words</li>
                <li>Average reading time: {noteStats.averageReadingTime} min</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="card-heading">Usage Highlights</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  Busiest day:{' '}
                  {usageStats.busiestDay ? `${usageStats.busiestDay.date} (${usageStats.busiestDay.count} notes)` : '—'}
                </li>
                <li>
                  Deepest focus session:{' '}
                  {usageStats.peakFocusSession
                    ? `${formatDate(usageStats.peakFocusSession.startedAt)} for ${usageStats.peakFocusSession.durationMinutes} min`
                    : '—'}
                </li>
                <li>Average note age: {usageStats.averageNoteAgeDays} days</li>
                <li>Recommended focus length: {usageStats.recommendedFocus.toFixed(0)} min</li>
                <li>Quality indicator: {usageStats.qualityIndicator}/5</li>
                <li>
                  Top tags:{' '}
                  {usageStats.topTags.length > 0
                    ? usageStats.topTags.map((tag) => `#${tag.tag}`).join(', ')
                    : '—'}
                </li>
              </ul>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <h3 className="card-heading">Goal Progress</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {goalProgress.map((item) => (
                  <div key={item.goal.id} className="rounded-2xl bg-slate-900/60 p-4">
                    <h4 className="text-sm font-semibold text-white">{item.goal.title}</h4>
                    <p className="text-xs text-slate-400">Target: {item.goal.targetValue}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">{item.progressPercentage}%</p>
                        <p className="text-xs text-slate-400">Remaining {item.remaining}</p>
                      </div>
                      <div className="text-xs text-slate-400">
                        Deadline
                        <p className="font-medium text-slate-200">
                          {item.goal.deadline ? formatDate(item.goal.deadline) : 'No deadline'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="card-heading">Recommendations</h3>
              <div className="space-y-3">
                {insights.map((insight) => (
                  <InsightBadge key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
