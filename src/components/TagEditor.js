import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Palette, Plus, Save, Split, Trash2 } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { cn } from '../utils/cn';
const emptyForm = {
    name: '',
    color: '#38bdf8',
    description: '',
    parentId: ''
};
export const TagEditor = ({ activeTag, onDone }) => {
    const { addTag, updateTag, deleteTag, mergeTags, tags } = useTags();
    const [form, setForm] = useState(emptyForm);
    const [mergeTarget, setMergeTarget] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        if (activeTag) {
            setForm({
                name: activeTag.name,
                color: activeTag.color,
                description: activeTag.description ?? '',
                parentId: activeTag.parentId ?? ''
            });
        }
        else {
            setForm(emptyForm);
        }
        setMergeTarget('');
        setError(null);
    }, [activeTag]);
    const parentOptions = useMemo(() => tags.filter((tag) => !activeTag || tag.id !== activeTag.id), [tags, activeTag]);
    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        try {
            if (activeTag) {
                updateTag(activeTag.id, {
                    name: form.name,
                    color: form.color,
                    description: form.description || undefined,
                    parentId: form.parentId || null
                });
            }
            else {
                addTag({
                    name: form.name,
                    color: form.color,
                    description: form.description || undefined,
                    parentId: form.parentId || null
                });
            }
            onDone?.();
            setForm(emptyForm);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save tag');
        }
    };
    const handleDelete = () => {
        if (!activeTag)
            return;
        deleteTag(activeTag.id);
        onDone?.();
    };
    const handleMerge = () => {
        if (!activeTag || !mergeTarget)
            return;
        mergeTags(activeTag.id, mergeTarget);
        onDone?.();
    };
    return (_jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h2", { className: "flex items-center gap-2 text-lg font-semibold text-white", children: [_jsx(Palette, { className: "h-5 w-5 text-sky-300", "aria-hidden": true }), activeTag ? 'Edit tag' : 'Create a tag'] }) }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { className: "space-y-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-200", children: "Name" }), _jsx("input", { required: true, value: form.name, onChange: (event) => setForm((prev) => ({ ...prev, name: event.target.value })), className: "w-full rounded-lg border border-white/5 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40", placeholder: "e.g. Research", "aria-label": "Tag name" })] }), _jsxs("label", { className: "space-y-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-200", children: "Color" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { value: form.color, onChange: (event) => setForm((prev) => ({ ...prev, color: event.target.value.toLowerCase() })), type: "color", className: "h-11 w-16 cursor-pointer rounded-lg border border-white/5 bg-slate-950/70", "aria-label": "Tag color" }), _jsx("span", { className: "text-xs uppercase tracking-widest text-slate-400", children: form.color })] })] }), _jsxs("label", { className: "space-y-2 sm:col-span-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-200", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (event) => setForm((prev) => ({ ...prev, description: event.target.value })), className: "w-full rounded-lg border border-white/5 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40", placeholder: "What does this tag represent?", rows: 3 })] }), _jsxs("label", { className: "space-y-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-200", children: "Parent category" }), _jsxs("select", { value: form.parentId, onChange: (event) => setForm((prev) => ({ ...prev, parentId: event.target.value })), className: "w-full rounded-lg border border-white/5 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40", children: [_jsx("option", { value: "", children: "No parent" }), parentOptions.map((tag) => (_jsx("option", { value: tag.id, children: tag.name }, tag.id)))] })] })] }), error && _jsx("p", { className: "text-sm text-rose-400", children: error }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("button", { type: "submit", className: cn('inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400', activeTag ? 'bg-sky-500/80 hover:bg-sky-500' : 'bg-emerald-500/80 hover:bg-emerald-500'), children: activeTag ? (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4", "aria-hidden": true }), "Save changes"] })) : (_jsxs(_Fragment, { children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": true }), "Create tag"] })) }), activeTag && (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", onClick: handleDelete, className: "inline-flex items-center gap-2 rounded-lg border border-white/5 bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400", children: [_jsx(Trash2, { className: "h-4 w-4", "aria-hidden": true }), "Delete"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("select", { value: mergeTarget, onChange: (event) => setMergeTarget(event.target.value), className: "rounded-lg border border-white/5 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40", children: [_jsx("option", { value: "", children: "Merge into..." }), parentOptions
                                                .filter((tag) => tag.id !== activeTag.id)
                                                .map((tag) => (_jsx("option", { value: tag.id, children: tag.name }, tag.id)))] }), _jsxs("button", { type: "button", onClick: handleMerge, disabled: !mergeTarget, className: "inline-flex items-center gap-2 rounded-lg border border-white/5 bg-violet-500/20 px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60", children: [_jsx(Split, { className: "h-4 w-4", "aria-hidden": true }), "Merge"] })] })] }))] })] }));
};
