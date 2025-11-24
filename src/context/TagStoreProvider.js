import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { nanoid } from 'nanoid';
import { createTagSchema, updateTagSchema } from '../lib/tagValidation';
import { defaultTags } from '../data/initialTags';
import { defaultNotes } from '../data/initialNotes';
const STORAGE_KEY = 'modern-notes-tag-state';
const loadState = () => {
    if (typeof window === 'undefined')
        return { tags: defaultTags, noteTags: [], feedback: [] };
    try {
        const persisted = window.localStorage.getItem(STORAGE_KEY);
        if (!persisted)
            return { tags: defaultTags, noteTags: [], feedback: [] };
        const parsed = JSON.parse(persisted);
        return {
            tags: parsed.tags ?? defaultTags,
            noteTags: parsed.noteTags ?? [],
            feedback: parsed.feedback ?? []
        };
    }
    catch (error) {
        console.warn('Failed to load tag state', error);
        return { tags: defaultTags, noteTags: [], feedback: [] };
    }
};
const persistState = (state) => {
    if (typeof window === 'undefined')
        return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    catch (error) {
        console.warn('Failed to persist tag state', error);
    }
};
const initialState = {
    tags: defaultTags,
    noteTags: [],
    feedback: []
};
const tagReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TAG':
            return { ...state, tags: [...state.tags, action.payload] };
        case 'UPDATE_TAG':
            return {
                ...state,
                tags: state.tags.map((tag) => tag.id === action.payload.id ? { ...tag, ...action.payload.data } : tag)
            };
        case 'DELETE_TAG':
            return {
                ...state,
                tags: state.tags.filter((tag) => tag.id !== action.payload.id),
                noteTags: state.noteTags.filter((item) => item.tagId !== action.payload.id)
            };
        case 'MERGE_TAGS':
            return {
                ...state,
                tags: state.tags
                    .filter((tag) => tag.id !== action.payload.sourceId)
                    .map((tag) => tag.parentId === action.payload.sourceId
                    ? { ...tag, parentId: action.payload.targetId }
                    : tag)
                    .map((tag) => tag.id === action.payload.targetId
                    ? {
                        ...tag,
                        usageCount: tag.usageCount +
                            (state.tags.find((item) => item.id === action.payload.sourceId)?.usageCount ?? 0)
                    }
                    : tag),
                noteTags: state.noteTags.map((item) => item.tagId === action.payload.sourceId
                    ? { ...item, tagId: action.payload.targetId }
                    : item)
            };
        case 'RENAME_TAG':
            return {
                ...state,
                tags: state.tags.map((tag) => tag.id === action.payload.id ? { ...tag, name: action.payload.name } : tag)
            };
        case 'APPLY_TAG': {
            const alreadyApplied = state.noteTags.some((item) => item.noteId === action.payload.noteId && item.tagId === action.payload.tagId);
            if (alreadyApplied) {
                return state;
            }
            return {
                ...state,
                noteTags: [...state.noteTags, action.payload],
                tags: state.tags.map((tag) => tag.id === action.payload.tagId
                    ? { ...tag, usageCount: tag.usageCount + 1 }
                    : tag)
            };
        }
        case 'REMOVE_TAG':
            return {
                ...state,
                noteTags: state.noteTags.filter((item) => !(item.noteId === action.payload.noteId && item.tagId === action.payload.tagId)),
                tags: state.tags.map((tag) => tag.id === action.payload.tagId && tag.usageCount > 0
                    ? { ...tag, usageCount: Math.max(0, tag.usageCount - 1) }
                    : tag)
            };
        case 'RECORD_FEEDBACK':
            return { ...state, feedback: [...state.feedback, action.payload] };
        default:
            return state;
    }
};
const TagStoreContext = createContext(undefined);
export const TagStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tagReducer, initialState, () => {
        if (typeof window === 'undefined') {
            return initialState;
        }
        return loadState();
    });
    const persistTimeoutRef = useRef();
    useEffect(() => {
        // Debounce localStorage writes to avoid excessive I/O
        if (persistTimeoutRef.current) {
            clearTimeout(persistTimeoutRef.current);
        }
        persistTimeoutRef.current = setTimeout(() => {
            persistState(state);
        }, 500); // Write after 500ms of inactivity
        return () => {
            if (persistTimeoutRef.current) {
                clearTimeout(persistTimeoutRef.current);
            }
        };
    }, [state]);
    const notes = useMemo(() => defaultNotes, []);
    const actions = useMemo(() => ({
        addTag: (input) => {
            const parsed = createTagSchema.parse(input);
            const newTag = {
                ...parsed,
                id: parsed.id ?? `tag-${nanoid(8)}`,
                createdAt: parsed.createdAt ?? Date.now(),
                usageCount: parsed.usageCount ?? 0
            };
            dispatch({ type: 'ADD_TAG', payload: newTag });
            return newTag;
        },
        updateTag: (id, data) => {
            const parsed = updateTagSchema.parse(data);
            dispatch({ type: 'UPDATE_TAG', payload: { id, data: parsed } });
        },
        deleteTag: (id) => {
            dispatch({ type: 'DELETE_TAG', payload: { id } });
        },
        mergeTags: (sourceId, targetId) => {
            dispatch({ type: 'MERGE_TAGS', payload: { sourceId, targetId } });
        },
        renameTag: (id, name) => {
            dispatch({ type: 'RENAME_TAG', payload: { id, name } });
        },
        applyTag: (noteId, tagId, source) => {
            const noteTag = {
                noteId,
                tagId,
                source,
                appliedAt: Date.now()
            };
            dispatch({ type: 'APPLY_TAG', payload: noteTag });
        },
        removeTag: (noteId, tagId) => {
            dispatch({ type: 'REMOVE_TAG', payload: { noteId, tagId } });
        },
        recordFeedback: ({ tagId, accepted, noteId }) => {
            const feedback = {
                tagId,
                accepted,
                noteId,
                feedbackAt: Date.now()
            };
            dispatch({ type: 'RECORD_FEEDBACK', payload: feedback });
        }
    }), []);
    const value = useMemo(() => ({
        state,
        actions,
        notes
    }), [state, actions, notes]);
    return _jsx(TagStoreContext.Provider, { value: value, children: children });
};
export const useTagStoreContext = () => {
    const context = useContext(TagStoreContext);
    if (!context) {
        throw new Error('useTagStoreContext must be used within TagStoreProvider');
    }
    return context;
};
