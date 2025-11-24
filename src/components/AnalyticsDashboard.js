import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { getPresetRange, formatDate } from '../utils/date';
import { useAnalytics } from '../hooks/useAnalytics';
import { useProductivityMetrics } from '../hooks/useProductivityMetrics';
import { useUsageStats } from '../hooks/useUsageStats';
import { prepareCsvData, prepareJsonData } from '../utils/analytics';
const COLORS = ['#4F46E5', '#22D3EE', '#F97316', '#14B8A6', '#8B5CF6'];
const InsightBadge = memo(({ insight }) => {
    const colorMap = {
        positive: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
        warning: 'bg-amber-500/10 text-amber-200 border-amber-500/40',
        info: 'bg-sky-500/10 text-sky-200 border-sky-500/40'
    };
    return (_jsxs("div", { className: `border rounded-xl p-4 flex flex-col gap-1 ${colorMap[insight.severity]}`, children: [_jsx("span", { className: "text-sm uppercase tracking-wide font-semibold", children: insight.title }), _jsx("p", { className: "text-sm text-slate-200/80 leading-relaxed", children: insight.description })] }));
});
InsightBadge.displayName = 'InsightBadge';
// Memoize chart components for better performance
const NoteFrequencyChart = memo(({ data }) => (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937" }), _jsx(XAxis, { dataKey: "date", stroke: "#94a3b8", tick: { fontSize: 12 } }), _jsx(YAxis, { stroke: "#94a3b8", tick: { fontSize: 12 } }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' } }), _jsx(Bar, { dataKey: "count", fill: "#4F46E5", radius: [8, 8, 0, 0] })] }) }) })));
NoteFrequencyChart.displayName = 'NoteFrequencyChart';
const TaskCompletionChart = memo(({ completed, pending }) => (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { dataKey: "value", data: [{ name: 'Completed', value: completed }, { name: 'Pending', value: pending }], innerRadius: 60, outerRadius: 80, paddingAngle: 5, children: [0, 1].map((index) => (_jsx(Cell, { fill: index === 0 ? '#22D3EE' : '#F97316' }, index))) }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' } }), _jsx(Legend, { wrapperStyle: { color: '#e2e8f0' } })] }) }) })));
TaskCompletionChart.displayName = 'TaskCompletionChart';
const FocusTrendChart = memo(({ data }) => (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "focusGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#22D3EE", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#22D3EE", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937" }), _jsx(XAxis, { dataKey: "period", stroke: "#94a3b8", tick: { fontSize: 12 } }), _jsx(YAxis, { stroke: "#94a3b8", tick: { fontSize: 12 } }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' } }), _jsx(Area, { type: "monotone", dataKey: "focusMinutes", stroke: "#22D3EE", fill: "url(#focusGradient)", strokeWidth: 2 })] }) }) })));
FocusTrendChart.displayName = 'FocusTrendChart';
const TagUsageChart = memo(({ data }) => (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data.slice(0, 6), layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937" }), _jsx(XAxis, { type: "number", stroke: "#94a3b8", tick: { fontSize: 12 } }), _jsx(YAxis, { dataKey: "tag", type: "category", stroke: "#94a3b8", tick: { fontSize: 12 }, width: 100 }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#111827', borderRadius: '0.75rem', border: '1px solid #1f2937' } }), _jsx(Bar, { dataKey: "count", radius: [0, 8, 8, 0], children: data.slice(0, 6).map((_, index) => (_jsx(Cell, { fill: ['#4F46E5', '#22D3EE', '#F97316', '#14B8A6', '#8B5CF6'][index % 5] }, index))) })] }) }) })));
TagUsageChart.displayName = 'TagUsageChart';
const AnalyticsDashboard = memo(({ data }) => {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [dateRange, setDateRange] = useState(() => {
        const preset = '30d';
        const presetRange = getPresetRange(preset);
        return { preset, ...presetRange };
    });
    const [trendView, setTrendView] = useState('daily');
    const { raw, currentRangeData, noteFrequency, taskMetrics, focusMetrics, tagUsage, noteStats, trendData, goalProgress, comparison, insights } = useAnalytics(data, {
        dateRange,
        analyticsEnabled,
        trendView
    });
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
    const handlePresetChange = (preset) => {
        if (preset === 'custom') {
            setDateRange((prev) => ({ ...prev, preset }));
            return;
        }
        const { start, end } = getPresetRange(preset);
        setDateRange({ preset, start, end });
    };
    const handleCustomChange = (field, value) => {
        setDateRange((prev) => ({
            ...prev,
            preset: 'custom',
            [field]: value ? new Date(value) : prev[field]
        }));
    };
    const exportFile = (format) => {
        const blob = new Blob([
            format === 'csv'
                ? prepareCsvData(raw.notes, raw.tasks, raw.focusSessions)
                : prepareJsonData(raw.notes, raw.tasks, raw.focusSessions, raw.goals)
        ], { type: format === 'csv' ? 'text/csv' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${format}-${new Date().toISOString()}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const analyticsNotice = useMemo(() => {
        if (analyticsEnabled)
            return null;
        return (_jsxs("div", { className: "card border-primary/40 text-slate-200", children: [_jsx("h3", { className: "card-heading", children: "Analytics disabled" }), _jsx("p", { className: "text-sm text-slate-300/80", children: "Analytics are processed privately on your device. Toggle the switch above to opt-in and view insights. No data leaves your browser." })] }));
    }, [analyticsEnabled]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Analytics Dashboard" }), _jsx("p", { className: "text-slate-300 max-w-2xl", children: "Gain visibility into your note-taking habits, focus time, and productivity trends. All analytics are computed on-device with optional opt-in." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm text-slate-300", children: "Privacy-first analytics" }), _jsx("button", { type: "button", onClick: () => setAnalyticsEnabled((prev) => !prev), className: `relative inline-flex h-8 w-16 items-center rounded-full border border-slate-700 transition-colors duration-300 ${analyticsEnabled ? 'bg-primary border-primary-dark' : 'bg-slate-800'}`, "aria-pressed": analyticsEnabled, children: _jsx("span", { className: `inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${analyticsEnabled ? 'translate-x-8' : 'translate-x-2'}` }) })] })] }), _jsxs("section", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Productivity Score" }), _jsx("p", { className: "metric-value", children: productivity.productivityScore }), _jsx("p", { className: "metric-subtext", children: "Composite score based on focus, note creation, and task completion" })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Focus Minutes" }), _jsx("p", { className: "metric-value", children: focusMetrics.totalMinutes }), _jsxs("p", { className: "metric-subtext", children: [productivity.averageDailyFocusMinutes, " min avg per day"] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Task Completion" }), _jsxs("p", { className: "metric-value", children: [taskMetrics.completionRate, "%"] }), _jsxs("p", { className: "metric-subtext", children: [taskMetrics.completed, " of ", taskMetrics.total, " tasks completed"] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Current Streak" }), _jsxs("p", { className: "metric-value", children: [productivity.streak.current, " days"] }), _jsxs("p", { className: "metric-subtext", children: ["Longest streak: ", productivity.streak.longest, " days"] })] })] }), _jsx("section", { className: "card", children: _jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "card-heading mb-1", children: "Filters" }), _jsx("p", { className: "text-sm text-slate-300", children: "Explore trends over custom time ranges and compare against previous periods." })] }), _jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center", children: [_jsxs("select", { value: dateRange.preset, onChange: (event) => handlePresetChange(event.target.value), className: "rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "7d", children: "Last 7 days" }), _jsx("option", { value: "30d", children: "Last 30 days" }), _jsx("option", { value: "90d", children: "Last 90 days" }), _jsx("option", { value: "365d", children: "Last 12 months" }), _jsx("option", { value: "custom", children: "Custom range" })] }), dateRange.preset === 'custom' && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-200", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { children: "Start" }), _jsx("input", { type: "date", value: formatDate(dateRange.start), onChange: (event) => handleCustomChange('start', event.target.value), className: "rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { children: "End" }), _jsx("input", { type: "date", value: formatDate(dateRange.end), onChange: (event) => handleCustomChange('end', event.target.value), className: "rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1" })] })] })), _jsxs("select", { value: trendView, onChange: (event) => setTrendView(event.target.value), className: "rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "daily", children: "Daily view" }), _jsx("option", { value: "weekly", children: "Weekly view" }), _jsx("option", { value: "monthly", children: "Monthly view" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => exportFile('csv'), className: "rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm hover:border-primary", children: "Export CSV" }), _jsx("button", { type: "button", onClick: () => exportFile('json'), className: "rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm hover:border-primary", children: "Export JSON" })] })] })] }) }), analyticsNotice, analyticsEnabled && (_jsxs(_Fragment, { children: [_jsxs("section", { className: "grid gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "card lg:col-span-2", children: [_jsx("h3", { className: "card-heading", children: "Note Creation Frequency" }), _jsx(NoteFrequencyChart, { data: noteFrequency })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Task Completion Rate" }), _jsx(TaskCompletionChart, { completed: taskMetrics.completed, pending: taskMetrics.pending })] })] }), _jsxs("section", { className: "grid gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Focus Time Trend" }), _jsx(FocusTrendChart, { data: trendData })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Tag Usage" }), _jsx(TagUsageChart, { data: tagUsage })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Productivity Comparison" }), _jsx("div", { className: "space-y-3", children: comparison.map((item) => (_jsxs("div", { className: "rounded-xl bg-slate-900/70 p-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-slate-300", children: [_jsx("span", { children: item.metric }), _jsxs("span", { className: `font-semibold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`, children: [item.change >= 0 ? '+' : '', item.change, " (", item.changePercentage, "%)"] })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-slate-400", children: [_jsxs("span", { children: ["Current: ", item.currentValue] }), _jsxs("span", { children: ["Previous: ", item.previousValue] })] })] }, item.metric))) })] })] }), _jsxs("section", { className: "grid gap-4 lg:grid-cols-2", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Note Length & Reading Time" }), _jsxs("ul", { className: "space-y-2 text-sm text-slate-300", children: [_jsxs("li", { children: ["Average words: ", noteStats.averageWordCount] }), _jsxs("li", { children: ["Median words: ", noteStats.medianWordCount] }), _jsxs("li", { children: ["Shortest note: ", noteStats.minWordCount, " words"] }), _jsxs("li", { children: ["Longest note: ", noteStats.maxWordCount, " words"] }), _jsxs("li", { children: ["Average reading time: ", noteStats.averageReadingTime, " min"] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Usage Highlights" }), _jsxs("ul", { className: "space-y-2 text-sm text-slate-300", children: [_jsxs("li", { children: ["Busiest day:", ' ', usageStats.busiestDay ? `${usageStats.busiestDay.date} (${usageStats.busiestDay.count} notes)` : '—'] }), _jsxs("li", { children: ["Deepest focus session:", ' ', usageStats.peakFocusSession
                                                        ? `${formatDate(usageStats.peakFocusSession.startedAt)} for ${usageStats.peakFocusSession.durationMinutes} min`
                                                        : '—'] }), _jsxs("li", { children: ["Average note age: ", usageStats.averageNoteAgeDays, " days"] }), _jsxs("li", { children: ["Recommended focus length: ", usageStats.recommendedFocus.toFixed(0), " min"] }), _jsxs("li", { children: ["Quality indicator: ", usageStats.qualityIndicator, "/5"] }), _jsxs("li", { children: ["Top tags:", ' ', usageStats.topTags.length > 0
                                                        ? usageStats.topTags.map((tag) => `#${tag.tag}`).join(', ')
                                                        : '—'] })] })] })] }), _jsxs("section", { className: "grid gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "card lg:col-span-2", children: [_jsx("h3", { className: "card-heading", children: "Goal Progress" }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: goalProgress.map((item) => (_jsxs("div", { className: "rounded-2xl bg-slate-900/60 p-4", children: [_jsx("h4", { className: "text-sm font-semibold text-white", children: item.goal.title }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Target: ", item.goal.targetValue] }), _jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold text-primary", children: [item.progressPercentage, "%"] }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Remaining ", item.remaining] })] }), _jsxs("div", { className: "text-xs text-slate-400", children: ["Deadline", _jsx("p", { className: "font-medium text-slate-200", children: item.goal.deadline ? formatDate(item.goal.deadline) : 'No deadline' })] })] })] }, item.goal.id))) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "card-heading", children: "Recommendations" }), _jsx("div", { className: "space-y-3", children: insights.map((insight) => (_jsx(InsightBadge, { insight: insight }, insight.id))) })] })] })] }))] }));
});
AnalyticsDashboard.displayName = 'AnalyticsDashboard';
export default AnalyticsDashboard;
