import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { NotesList } from '../components/NotesList';
import { NoteEditor } from '../components/NoteEditor';
import { useCreateNote, useNotes, useNote, useUpdateNote } from '../hooks/useNotes';
const EmptyState = () => (_jsx("div", { className: "flex h-full items-center justify-center text-center text-slate-400", children: _jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold", children: "Select a note to start editing" }), _jsx("p", { className: "mt-2 text-sm", children: "Or create a new note from the list." })] }) }));
const NoteRoute = () => {
    const { noteId } = useParams();
    const note = useNote(noteId ?? '');
    const updateNote = useUpdateNote();
    if (!note) {
        return (_jsx("div", { className: "flex h-full items-center justify-center text-slate-400", children: _jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold", children: "Note not found" }), _jsx(Link, { to: "..", className: "mt-2 inline-block text-primary", children: "Go back to notes list" })] }) }));
    }
    return _jsx(NoteEditor, { note: note, onChange: updateNote }, note.id);
};
export const NotesLayout = () => {
    const notes = useNotes();
    const navigate = useNavigate();
    const createNote = useCreateNote();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) {
            return notes;
        }
        const query = searchQuery.trim().toLowerCase();
        return notes.filter((note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query));
    }, [notes, searchQuery]);
    const handleCreateNote = async () => {
        const newNote = await createNote({
            title: 'Untitled Note',
            content: '',
            pinned: false
        });
        navigate(`/notes/${newNote.id}`);
    };
    return (_jsxs("div", { className: "flex h-screen w-full overflow-hidden", children: [_jsxs("aside", { className: "flex w-96 flex-col border-r border-surface-border bg-surface-muted", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Your Notes" }), _jsx("button", { type: "button", className: "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/80", onClick: handleCreateNote, "aria-label": "Create a new note", children: "New" })] }), _jsxs("div", { className: "px-6", children: [_jsx("label", { className: "sr-only", htmlFor: "notes-search", children: "Search notes" }), _jsx("input", { id: "notes-search", type: "search", value: searchQuery, onChange: (event) => setSearchQuery(event.target.value), placeholder: "Search notes...", className: "mb-4 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(NotesList, { notes: filteredNotes }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto bg-surface p-8", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(EmptyState, {}) }), _jsx(Route, { path: ":noteId", element: _jsx(NoteRoute, {}) })] }) })] }));
};
