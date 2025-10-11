import { useContext, useMemo } from 'react';
import { NotesContext } from '../context/NotesContext';
import { Note, NoteInput } from '../types/note';

const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const useNotes = (): Note[] => {
  const { notes } = useNotesContext();
  return notes;
};

export const useNote = (id: string): Note | undefined => {
  const { notes } = useNotesContext();
  return useMemo(() => notes.find((note) => note.id === id), [notes, id]);
};

export const useCreateNote = () => {
  const { createNote } = useNotesContext();
  return (input: NoteInput) => createNote(input);
};

export const useUpdateNote = () => {
  const { updateNote } = useNotesContext();
  return (id: string, changes: Partial<Note>) => updateNote(id, changes);
};

export const useDeleteNote = () => {
  const { deleteNote } = useNotesContext();
  return (id: string) => deleteNote(id);
};
