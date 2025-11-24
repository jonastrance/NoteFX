import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { generateId } from '../lib/utils';
import { noteInputSchema, noteSchema } from '../validation/noteSchema';
const STORAGE_KEY = 'modern-notes-app::notes';
const initialState = {
    notes: [],
    isLoaded: false
};
const notesReducer = (state, action) => {
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
export const NotesContext = createContext(undefined);
const readFromStorage = () => {
    if (typeof window === 'undefined')
        return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        const parsedNotes = noteSchema.array().safeParse(parsed);
        if (!parsedNotes.success) {
            console.warn(parsedNotes.error);
            return [];
        }
        return parsedNotes.data;
    }
    catch (error) {
        console.warn('Failed to parse notes from storage', error);
        return [];
    }
};
const writeToStorage = (notes) => {
    if (typeof window === 'undefined')
        return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};
export const NotesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notesReducer, initialState);
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);
    useEffect(() => {
        const storedNotes = readFromStorage();
        dispatch({ type: 'INITIALIZE', payload: storedNotes });
    }, []);
    useEffect(() => {
        if (state.isLoaded) {
            writeToStorage(state.notes);
        }
    }, [state.notes, state.isLoaded]);
    const createNote = useCallback(async (input) => {
        const parsed = noteInputSchema.parse({
            ...input,
            title: input.title.trim() || 'Untitled Note'
        });
        const now = new Date().toISOString();
        const note = {
            id: generateId(),
            ...parsed,
            createdAt: now,
            updatedAt: now
        };
        dispatch({ type: 'CREATE', payload: note });
        return note;
    }, []);
    const updateNote = useCallback(async (id, changes) => {
        const existing = stateRef.current.notes.find((note) => note.id === id);
        if (!existing)
            return undefined;
        const updated = {
            ...existing,
            ...changes,
            title: (changes.title ?? existing.title).trim() || 'Untitled Note',
            updatedAt: new Date().toISOString()
        };
        const parsed = noteSchema.parse(updated);
        dispatch({ type: 'UPDATE', payload: parsed });
        return parsed;
    }, []);
    const deleteNote = useCallback(async (id) => {
        dispatch({ type: 'DELETE', payload: { id } });
    }, []);
    const value = useMemo(() => ({
        notes: state.notes,
        isLoaded: state.isLoaded,
        createNote,
        updateNote,
        deleteNote
    }), [state.notes, state.isLoaded, createNote, updateNote, deleteNote]);
    return _jsx(NotesContext.Provider, { value: value, children: children });
};
