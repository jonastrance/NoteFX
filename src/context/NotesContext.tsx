import { createContext, ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';
import { Note, NoteInput } from '../types/note';
import { generateId } from '../lib/utils';
import { noteInputSchema, noteSchema } from '../validation/noteSchema';

const STORAGE_KEY = 'modern-notes-app::notes';

interface NotesState {
  notes: Note[];
  isLoaded: boolean;
}

const initialState: NotesState = {
  notes: [],
  isLoaded: false
};

type NotesAction =
  | { type: 'INITIALIZE'; payload: Note[] }
  | { type: 'CREATE'; payload: Note }
  | { type: 'UPDATE'; payload: Note }
  | { type: 'DELETE'; payload: { id: string } };

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'INITIALIZE':
      return { notes: action.payload, isLoaded: true };
    case 'CREATE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE':
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.payload.id ? action.payload : note))
      };
    case 'DELETE':
      return { ...state, notes: state.notes.filter((note) => note.id !== action.payload.id) };
    default:
      return state;
  }
};

interface NotesContextValue {
  notes: Note[];
  isLoaded: boolean;
  createNote: (input: NoteInput) => Promise<Note>;
  updateNote: (id: string, changes: Partial<Note>) => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
}

export const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const readFromStorage = (): Note[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const parsedNotes = noteSchema.array().safeParse(parsed);
    if (!parsedNotes.success) {
      console.warn(parsedNotes.error);
      return [];
    }
    return parsedNotes.data;
  } catch (error) {
    console.warn('Failed to parse notes from storage', error);
    return [];
  }
};

const writeToStorage = (notes: Note[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    const storedNotes = readFromStorage();
    dispatch({ type: 'INITIALIZE', payload: storedNotes });
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      writeToStorage(state.notes);
    }
  }, [state.notes, state.isLoaded]);

  const createNote = useCallback(async (input: NoteInput) => {
    const parsed = noteInputSchema.parse({
      ...input,
      title: input.title.trim() || 'Untitled Note'
    });
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      ...parsed,
      createdAt: now,
      updatedAt: now
    };
    dispatch({ type: 'CREATE', payload: note });
    return note;
  }, []);

  const updateNote = useCallback(async (id: string, changes: Partial<Note>) => {
    const existing = state.notes.find((note) => note.id === id);
    if (!existing) return undefined;
    const updated: Note = {
      ...existing,
      ...changes,
      title: (changes.title ?? existing.title).trim() || 'Untitled Note',
      updatedAt: new Date().toISOString()
    };
    const parsed = noteSchema.parse(updated);
    dispatch({ type: 'UPDATE', payload: parsed });
    return parsed;
  }, [state.notes]);

  const deleteNote = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE', payload: { id } });
  }, []);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes: state.notes,
      isLoaded: state.isLoaded,
      createNote,
      updateNote,
      deleteNote
    }),
    [state.notes, state.isLoaded, createNote, updateNote, deleteNote]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
