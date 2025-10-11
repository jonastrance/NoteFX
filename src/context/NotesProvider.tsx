import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';
import type { Note } from '../types/note';
import { defaultNotes } from '../data/initialNotes';

export type NotesContextValue = {
  notes: Note[];
  selectedNoteId: string;
  selectNote: (id: string) => void;
  updateNoteContent: (id: string, content: string) => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({ children }: PropsWithChildren) => {
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(defaultNotes[0]?.id ?? '');

  const selectNote = (id: string) => setSelectedNoteId(id);

  const updateNoteContent = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, content, updatedAt: Date.now() } : note
      )
    );
  };

  const value = useMemo(
    () => ({
      notes,
      selectedNoteId,
      selectNote,
      updateNoteContent
    }),
    [notes, selectedNoteId]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within NotesProvider');
  }
  return context;
};
