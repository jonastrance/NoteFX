import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import clsx from 'clsx';
export function TaskFilter({ value, onChange }) {
    const id = useId();
    const update = (partial) => onChange({ ...value, ...partial });
    const filterClassName = (active) => clsx('rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary', active ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200');
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", role: "group", "aria-labelledby": `${id}-label`, children: [_jsx("span", { id: `${id}-label`, className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Filter" }), _jsx("div", { className: "flex items-center gap-1", children: [
                    { label: 'All', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Completed', value: 'completed' }
                ].map((option) => (_jsx("button", { type: "button", className: filterClassName(value.status === option.value), onClick: () => update({ status: option.value }), children: option.label }, option.value))) }), _jsx("div", { className: "flex items-center gap-1", children: [
                    { label: 'All priorities', value: 'all' },
                    { label: 'High', value: 'high' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Low', value: 'low' }
                ].map((option) => (_jsx("button", { type: "button", className: filterClassName(value.priority === option.value), onClick: () => update({ priority: option.value }), children: option.label }, option.value))) }), _jsx("div", { className: "flex items-center gap-1", children: [
                    { label: 'Any due date', value: 'all' },
                    { label: 'Overdue', value: 'overdue' },
                    { label: 'Upcoming', value: 'upcoming' }
                ].map((option) => (_jsx("button", { type: "button", className: filterClassName(value.due === option.value), onClick: () => update({ due: option.value }), children: option.label }, option.value))) })] }));
}
