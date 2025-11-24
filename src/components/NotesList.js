import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useDeleteNote, useUpdateNote } from '../hooks/useNotes';
import { formatRelativeTime } from '../lib/formatRelativeTime';
import { cn } from '../lib/utils';
export const NotesList = ({ notes }) => {
    const location = useLocation();
    const deleteNote = useDeleteNote();
    const updateNote = useUpdateNote();
    const sortedNotes = [...notes].sort((a, b) => {
        if (a.pinned && !b.pinned)
            return -1;
        if (!a.pinned && b.pinned)
            return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    if (sortedNotes.length === 0) {
        return (_jsx("p", { className: "px-6 py-10 text-center text-sm text-slate-400", children: "No notes yet. Create your first note!" }));
    }
    return (_jsx("ul", { className: "space-y-2 px-4 pb-6", children: sortedNotes.map((note) => {
            const isActive = location.pathname.endsWith(note.id);
            return (_jsx("li", { children: _jsxs("article", { className: cn('group relative overflow-hidden rounded-lg border border-transparent bg-surface px-4 py-3 transition hover:border-primary/40 hover:bg-surface/80', isActive && 'border-primary bg-surface/80'), children: [_jsxs(Link, { to: `/notes/${note.id}`, className: "block", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("h2", { className: "max-w-[12rem] truncate text-sm font-semibold text-white", children: note.title || 'Untitled' }), note.pinned && (_jsx("span", { className: "ml-2 rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary", children: "Pinned" }))] }), _jsx("p", { className: "mt-2 max-h-12 overflow-hidden text-xs text-slate-400 whitespace-pre-wrap", children: note.content || 'Empty note' }), _jsxs("time", { className: "mt-3 block text-[0.7rem] uppercase tracking-wide text-slate-500", children: ["Updated ", formatRelativeTime(note.updatedAt)] })] }), _jsxs("div", { className: "mt-3 flex justify-between text-xs text-slate-500", children: [_jsx("button", { type: "button", className: "rounded px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-surface-border/30", onClick: () => {
                                        void updateNote(note.id, { pinned: !note.pinned });
                                    }, "aria-label": note.pinned ? 'Unpin note' : 'Pin note', children: note.pinned ? 'Unpin' : 'Pin' }), _jsx("button", { type: "button", className: "rounded px-2 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10", onClick: () => {
                                        void deleteNote(note.id);
                                    }, "aria-label": "Delete note", children: "Delete" })] })] }) }, note.id));
        }) }));
};
