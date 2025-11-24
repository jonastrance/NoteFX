import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { differenceInMinutes, isBefore } from 'date-fns';
const DUE_SOON_THRESHOLD_MINUTES = 60 * 24;
export function NotificationCenter({ tasks }) {
    const now = new Date();
    const dueSoonTasks = tasks.filter((task) => {
        if (!task.dueDate || task.status === 'completed') {
            return false;
        }
        const dueDate = new Date(task.dueDate);
        const minutesUntilDue = differenceInMinutes(dueDate, now);
        const hasReminder = task.reminders?.some((reminder) => minutesUntilDue <= reminder.minutesBefore);
        return minutesUntilDue <= DUE_SOON_THRESHOLD_MINUTES || hasReminder || isBefore(dueDate, now);
    });
    if (dueSoonTasks.length === 0) {
        return null;
    }
    return (_jsxs("section", { "aria-label": "Task reminders", className: "mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm", children: [_jsx("h2", { className: "mb-2 text-sm font-semibold uppercase tracking-wide", children: "Reminders" }), _jsx("ul", { className: "space-y-2", children: dueSoonTasks.map((task) => {
                    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
                    return (_jsxs("li", { className: "flex flex-col rounded-lg bg-white/50 p-3", children: [_jsx("p", { className: "font-medium", children: task.title }), _jsxs("p", { className: "text-sm text-amber-700", children: ["Due ", dueDate, task.noteId ? ` · Linked to note ${task.noteId.slice(0, 8)}` : ''] })] }, task.id));
                }) })] }));
}
