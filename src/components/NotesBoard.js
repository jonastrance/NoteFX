import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Edit3, NotebookPen, Search } from 'lucide-react';
import { useNotesContext } from '../context/NotesProvider';
import { useTags } from '../hooks/useTags';
import { useApplyTag } from '../hooks/useApplyTag';
import { TagBadge } from './TagBadge';
import { cn } from '../utils/cn';
import { dateFormatCache } from '../utils/dateFormatCache';
export const NotesBoard = () => {
    const { notes, selectedNoteId, selectNote, updateNoteContent } = useNotesContext();
    const { tags, noteTags } = useTags();
    const { apply, remove } = useApplyTag();
    const [manualQuery, setManualQuery] = useState('');
    const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId) ?? null, [notes, selectedNoteId]);
    const assignedTags = useMemo(() => noteTags
        .filter((item) => item.noteId === selectedNoteId)
        .map((assignment) => tags.find((tag) => tag.id === assignment.tagId))
        .filter(Boolean), [noteTags, selectedNoteId, tags]);
    const availableManualTags = useMemo(() => {
        const lower = manualQuery.toLowerCase();
        return tags.filter((tag) => tag.name.toLowerCase().includes(lower) &&
            !assignedTags.some((assigned) => assigned?.id === tag.id));
    }, [tags, manualQuery, assignedTags]);
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[200px_1fr]", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400", children: [_jsx(NotebookPen, { className: "h-4 w-4 text-sky-300", "aria-hidden": true }), "Notes"] }), _jsx("ul", { className: "space-y-2", children: notes.map((note) => (_jsx("li", { children: _jsxs("button", { onClick: () => selectNote(note.id), className: cn('w-full rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-left text-sm transition hover:border-sky-400/40', note.id === selectedNoteId && 'border-sky-400/80 bg-sky-500/10 text-white'), children: [_jsx("p", { className: "font-semibold", children: note.title }), _jsx("p", { className: "text-xs text-slate-400", children: dateFormatCache.formatDate(note.updatedAt) })] }) }, note.id))) })] }), _jsx("div", { className: "space-y-4", children: selectedNote ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: selectedNote.title }), _jsxs("span", { className: "text-xs uppercase tracking-widest text-slate-500", children: ["Last updated ", dateFormatCache.formatDateTime(selectedNote.updatedAt)] })] }), _jsxs("label", { className: "block space-y-2", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-widest text-slate-400", children: "Note content" }), _jsx("textarea", { value: selectedNote.content, onChange: (event) => updateNoteContent(selectedNote.id, event.target.value), className: "h-40 w-full rounded-lg border border-white/5 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-semibold uppercase tracking-widest text-slate-400", children: "Applied tags" }), _jsx(Edit3, { className: "h-4 w-4 text-slate-500", "aria-hidden": true })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: assignedTags.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No tags applied yet." })) : (assignedTags.map((tag) => (_jsx(TagBadge, { tag: tag, onRemove: () => remove(tag.id) }, tag.id)))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold uppercase tracking-widest text-slate-400", children: "Manual override" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), _jsx("input", { value: manualQuery, onChange: (event) => setManualQuery(event.target.value), placeholder: "Search tags to apply...", className: "w-full rounded-lg border border-white/5 bg-slate-950/60 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40" })] }), manualQuery && (_jsx("ul", { className: "max-h-40 space-y-2 overflow-y-auto", children: availableManualTags.length === 0 ? (_jsx("li", { className: "text-xs text-slate-500", children: "No tags match that search." })) : (availableManualTags.map((tag) => (_jsx("li", { children: _jsxs("button", { onClick: () => {
                                                apply(tag.id, 'manual', true);
                                                setManualQuery('');
                                            }, className: "flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-emerald-400/40", children: [_jsx("span", { children: tag.name }), _jsx("span", { className: "text-[10px] uppercase tracking-widest text-slate-500", children: "Apply" })] }) }, tag.id)))) }))] })] })) : (_jsx("p", { className: "text-sm text-slate-400", children: "Select a note to start tagging." })) })] }));
};
