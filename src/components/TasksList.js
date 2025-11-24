import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useNotes } from '../modules/notes/useNotes';
const priorityStyles = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700'
};
// Memoize individual task item to reduce re-renders
const TaskItem = memo(({ task, note, onEdit, onDelete, onToggle }) => {
    const dueLabel = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
    return (_jsx("li", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm", children: _jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", "aria-label": task.status === 'completed' ? 'Mark as pending' : 'Mark as completed', className: clsx('flex h-8 w-8 items-center justify-center rounded-full border transition-colors', task.status === 'completed'
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-slate-300 bg-white text-slate-500 hover:border-primary hover:text-primary'), onClick: onToggle, children: _jsx(CheckCircleIcon, { className: "h-5 w-5", "aria-hidden": true }) }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold text-slate-900", children: task.title }), task.description ? (_jsx("p", { className: "text-sm text-slate-600", children: task.description })) : null] })] }), _jsxs("dl", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-600", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Due" }), _jsx("dd", { children: dueLabel })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Priority" }), _jsx("dd", { children: _jsx("span", { className: clsx('rounded-full px-2 py-0.5 text-xs font-semibold', priorityStyles[task.priority]), children: task.priority }) })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Status" }), _jsx("dd", { children: task.status })] }), note ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Note" }), _jsx("dd", { className: "rounded bg-indigo-100 px-2 py-0.5 text-indigo-700", children: note.title })] })) : null, task.recurrence ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Repeats" }), _jsxs("dd", { children: [task.recurrence.interval ?? 1, " ", task.recurrence.pattern, task.recurrence.interval && task.recurrence.interval > 1 ? 's' : ''] })] })) : null, task.reminders?.length ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("dt", { className: "font-medium uppercase tracking-wide", children: "Reminders" }), _jsx("dd", { children: task.reminders
                                                .map((reminder) => `${reminder.minutesBefore} min before`)
                                                .join(', ') })] })) : null] })] }), _jsxs("div", { className: "flex gap-2 self-start", children: [_jsxs("button", { type: "button", onClick: onEdit, className: "flex items-center gap-1 rounded-lg border border-transparent bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900", children: [_jsx(PencilSquareIcon, { className: "h-4 w-4", "aria-hidden": true }), " Edit"] }), _jsxs("button", { type: "button", onClick: onDelete, className: "flex items-center gap-1 rounded-lg border border-transparent bg-rose-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600", children: [_jsx(TrashIcon, { className: "h-4 w-4", "aria-hidden": true }), " Delete"] })] })] }) }));
});
TaskItem.displayName = 'TaskItem';
export const TasksList = memo(function TasksList({ tasks, onEditTask, onDeleteTask, onToggleComplete }) {
    const { notesMap } = useNotes();
    if (tasks.length === 0) {
        return _jsx("p", { className: "text-sm text-slate-500", children: "No tasks yet. Create one to get started." });
    }
    return (_jsx("ul", { className: "space-y-4", "aria-label": "Tasks list", children: tasks.map((task) => {
            const note = task.noteId ? notesMap[task.noteId] : null;
            return (_jsx(TaskItem, { task: task, note: note, onEdit: () => onEditTask(task.id), onDelete: () => onDeleteTask(task.id), onToggle: () => onToggleComplete(task.id, task.status === 'pending') }, task.id));
        }) }));
});
