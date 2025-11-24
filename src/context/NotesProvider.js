import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
import { defaultNotes } from '../data/initialNotes';
const NotesContext = createContext(undefined);
export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState(defaultNotes);
    const [selectedNoteId, setSelectedNoteId] = useState(defaultNotes[0]?.id ?? '');
    const selectNote = (id) => setSelectedNoteId(id);
    const updateNoteContent = (id, content) => {
        setNotes((prev) => prev.map((note) => note.id === id ? { ...note, content, updatedAt: Date.now() } : note));
    };
    const value = useMemo(() => ({
        notes,
        selectedNoteId,
        selectNote,
        updateNoteContent
    }), [notes, selectedNoteId]);
    return _jsx(NotesContext.Provider, { value: value, children: children });
};
export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotesContext must be used within NotesProvider');
    }
    return context;
};
