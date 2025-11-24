import { useContext, useMemo } from 'react';
import { NotesContext } from '../context/NotesContext';
const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
export const useNotes = () => {
    const { notes } = useNotesContext();
    return notes;
};
export const useNote = (id) => {
    const { notes } = useNotesContext();
    return useMemo(() => notes.find((note) => note.id === id), [notes, id]);
};
export const useCreateNote = () => {
    const { createNote } = useNotesContext();
    return (input) => createNote(input);
};
export const useUpdateNote = () => {
    const { updateNote } = useNotesContext();
    return (id, changes) => updateNote(id, changes);
};
export const useDeleteNote = () => {
    const { deleteNote } = useNotesContext();
    return (id) => deleteNote(id);
};
