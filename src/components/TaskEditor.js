import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../utils/taskSchema';
const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
];
const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
];
export function TaskEditor({ notes, initialTask, onSubmit, onCancel }) {
    const defaultValues = {
        title: '',
        description: '',
        dueDate: null,
        priority: 'medium',
        status: 'pending',
        noteId: null,
        recurrence: null,
        reminders: []
    };
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: initialTask
            ? {
                ...defaultValues,
                ...initialTask,
                dueDate: initialTask.dueDate ?? null,
                recurrence: initialTask.recurrence ?? null,
                reminders: initialTask.reminders ?? []
            }
            : defaultValues
    });
    const selectedRecurrence = watch('recurrence');
    const reminders = watch('reminders');
    useEffect(() => {
        if (initialTask) {
            reset({
                ...defaultValues,
                ...initialTask,
                dueDate: initialTask.dueDate ?? null,
                recurrence: initialTask.recurrence ?? null,
                reminders: initialTask.reminders ?? []
            });
        }
    }, [initialTask, reset]);
    const submitHandler = (values) => {
        onSubmit({
            ...values,
            description: values.description?.trim() ? values.description : undefined,
            dueDate: values.dueDate ?? undefined,
            noteId: values.noteId ?? undefined,
            recurrence: values.recurrence ?? undefined,
            reminders: values.reminders && values.reminders.length > 0 ? values.reminders : undefined
        });
        reset(defaultValues);
    };
    const toggleRecurrence = (pattern) => {
        if (selectedRecurrence?.pattern === pattern) {
            setValue('recurrence', null, { shouldValidate: true });
            return;
        }
        setValue('recurrence', { pattern, interval: 1 }, { shouldValidate: true });
    };
    const addReminder = () => {
        const next = [...(reminders ?? [])];
        if (next.length >= 3) {
            return;
        }
        next.push({ minutesBefore: 60 });
        setValue('reminders', next, { shouldValidate: true });
    };
    const updateReminder = (index, minutesBefore) => {
        const next = [...(reminders ?? [])];
        next[index] = { minutesBefore };
        setValue('reminders', next, { shouldValidate: true });
    };
    const removeReminder = (index) => {
        const next = [...(reminders ?? [])];
        next.splice(index, 1);
        setValue('reminders', next, { shouldValidate: true });
    };
    return (_jsxs("form", { onSubmit: handleSubmit(submitHandler), className: "mt-4 space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-slate-700", children: "Title" }), _jsx("input", { id: "title", type: "text", ...register('title'), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" }), errors.title ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.title.message }) : null] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-slate-700", children: "Description" }), _jsx("textarea", { id: "description", rows: 3, ...register('description'), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" }), errors.description ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.description.message }) : null] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "dueDate", className: "block text-sm font-medium text-slate-700", children: "Due date" }), _jsx("input", { id: "dueDate", type: "datetime-local", ...register('dueDate', {
                                    setValueAs: (value) => (value ? value : null)
                                }), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" }), errors.dueDate ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.dueDate.message }) : null] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "noteId", className: "block text-sm font-medium text-slate-700", children: "Link to note" }), _jsxs("select", { id: "noteId", ...register('noteId', {
                                    setValueAs: (value) => (value ? value : null)
                                }), className: "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20", children: [_jsx("option", { value: "", children: "No link" }), notes.map((note) => (_jsx("option", { value: note.id, children: note.title }, note.id)))] }), errors.noteId ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.noteId.message }) : null] })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("fieldset", { children: [_jsx("legend", { className: "text-sm font-medium text-slate-700", children: "Priority" }), _jsx("div", { className: "mt-2 flex gap-2", children: priorityOptions.map((option) => (_jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx("input", { type: "radio", value: option.value, ...register('priority') }), " ", option.label] }, option.value))) }), errors.priority ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.priority.message }) : null] }), _jsxs("fieldset", { children: [_jsx("legend", { className: "text-sm font-medium text-slate-700", children: "Status" }), _jsx("div", { className: "mt-2 flex gap-2", children: statusOptions.map((option) => (_jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx("input", { type: "radio", value: option.value, ...register('status') }), " ", option.label] }, option.value))) }), errors.status ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.status.message }) : null] })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-sm font-medium text-slate-700", children: "Recurrence" }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [([
                                { label: 'Daily', value: 'daily' },
                                { label: 'Weekly', value: 'weekly' },
                                { label: 'Monthly', value: 'monthly' }
                            ]).map((option) => (_jsx("button", { type: "button", className: `rounded-full px-3 py-1 text-xs font-semibold ${selectedRecurrence?.pattern === option.value
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, onClick: () => toggleRecurrence(option.value), children: option.label }, option.value))), selectedRecurrence ? (_jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: ["Every", _jsx("input", { type: "number", min: 1, max: 30, ...register('recurrence.interval', { valueAsNumber: true }), className: "w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" }), selectedRecurrence.pattern === 'monthly' ? 'month(s)' : selectedRecurrence.pattern === 'weekly' ? 'week(s)' : 'day(s)'] })) : null, errors.recurrence ? _jsx("p", { className: "w-full text-xs text-rose-600", children: "Invalid recurrence" }) : null] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-slate-700", children: "Reminders" }), _jsx("button", { type: "button", onClick: addReminder, className: "text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-slate-400", disabled: (reminders ?? []).length >= 3, children: "Add reminder" })] }), _jsx("ul", { className: "mt-2 space-y-2", children: (reminders ?? []).map((reminder, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx("span", { children: "Notify" }), _jsx("input", { type: "number", min: 5, max: 7 * 24 * 60, value: reminder.minutesBefore, onChange: (event) => updateReminder(index, Number(event.target.value)), className: "w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" }), _jsx("span", { children: "minutes before" })] }), _jsx("button", { type: "button", onClick: () => removeReminder(index), className: "text-xs font-medium text-rose-600 hover:underline", children: "Remove" })] }, index))) }), errors.reminders ? _jsx("p", { className: "mt-1 text-xs text-rose-600", children: errors.reminders.message }) : null] }), _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                            reset(defaultValues);
                            onCancel();
                        }, className: "rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500", children: "Cancel" }), _jsx("button", { type: "submit", className: "rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", children: initialTask ? 'Save changes' : 'Create task' })] })] }));
}
