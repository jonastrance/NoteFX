import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
const NotesContext = createContext(undefined);
const initialNotes = [
    {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Product strategy',
        content: 'Outline the Q3 roadmap with milestones and task dependencies.'
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Personal goals',
        content: 'Track personal development goals and daily routines.'
    }
];
export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(initialNotes);
    const addNote = (note) => {
        setNotes((prev) => [
            ...prev,
            {
                ...note,
                id: crypto.randomUUID()
            }
        ]);
    };
    const value = useMemo(() => ({
        notes,
        notesMap: Object.fromEntries(notes.map((note) => [note.id, note])),
        addNote
    }), [notes]);
    return _jsx(NotesContext.Provider, { value: value, children: children });
}
export function useNotesContext() {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotesContext must be used within a NotesProvider');
    }
    return context;
}
