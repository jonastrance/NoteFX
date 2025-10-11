import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
}

interface NotesContextValue {
  notes: Note[];
  notesMap: Record<string, Note>;
  addNote: (note: Omit<Note, 'id'>) => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const initialNotes: Note[] = [
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

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = (note: Omit<Note, 'id'>) => {
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

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotesContext(): NotesContextValue {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}
