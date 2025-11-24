import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { differenceInCalendarDays, isAfter } from 'date-fns';
export function TaskStatistics({ tasks }) {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const overdue = tasks.filter((task) => {
        if (!task.dueDate) {
            return false;
        }
        return isAfter(new Date(), new Date(task.dueDate)) && task.status !== 'completed';
    });
    const averageCompletionTime = calculateAverageCompletionTime(tasks);
    return (_jsxs("section", { className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm", "aria-labelledby": "task-stats-heading", children: [_jsx("h2", { id: "task-stats-heading", className: "text-xl font-semibold text-slate-900", children: "Task insights" }), _jsxs("dl", { className: "mt-4 grid gap-4 text-sm md:grid-cols-2", children: [_jsxs("div", { className: "rounded-lg bg-slate-50 p-4", children: [_jsx("dt", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Total tasks" }), _jsx("dd", { className: "text-2xl font-bold text-slate-900", children: total })] }), _jsxs("div", { className: "rounded-lg bg-slate-50 p-4", children: [_jsx("dt", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Completion rate" }), _jsxs("dd", { className: "text-2xl font-bold text-slate-900", children: [completionRate, "%"] })] }), _jsxs("div", { className: "rounded-lg bg-slate-50 p-4", children: [_jsx("dt", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Overdue tasks" }), _jsx("dd", { className: "text-2xl font-bold text-rose-600", children: overdue.length })] }), _jsxs("div", { className: "rounded-lg bg-slate-50 p-4", children: [_jsx("dt", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Avg. days to complete" }), _jsx("dd", { className: "text-2xl font-bold text-slate-900", children: averageCompletionTime.toFixed(1) })] })] })] }));
}
function calculateAverageCompletionTime(tasks) {
    const completedTasks = tasks.filter((task) => task.status === 'completed' && task.dueDate);
    if (completedTasks.length === 0) {
        return 0;
    }
    const totalDays = completedTasks.reduce((sum, task) => {
        if (!task.dueDate) {
            return sum;
        }
        const diff = differenceInCalendarDays(new Date(task.updatedAt), new Date(task.createdAt));
        return sum + Math.max(diff, 0);
    }, 0);
    return totalDays / completedTasks.length;
}
