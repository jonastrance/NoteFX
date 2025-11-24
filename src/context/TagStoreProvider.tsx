import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { nanoid } from 'nanoid';
import type { CreateTagInput, UpdateTagInput } from '../lib/tagValidation';
import { createTagSchema, updateTagSchema } from '../lib/tagValidation';
import type { Note } from '../types/note';
import type { ConfidenceLevel, NoteTag, Tag, TagFeedback } from '../types/tag';
import { defaultTags } from '../data/initialTags';
import { defaultNotes } from '../data/initialNotes';

export type TagStats = {
  totalTags: number;
  topTags: Tag[];
  hierarchyDepth: number;
  feedbackAcceptanceRate: number;
};

type TagState = {
  tags: Tag[];
  noteTags: NoteTag[];
  feedback: TagFeedback[];
};

const STORAGE_KEY = 'modern-notes-tag-state';

const loadState = (): TagState => {
  if (typeof window === 'undefined') return { tags: defaultTags, noteTags: [], feedback: [] };
  try {
    const persisted = window.localStorage.getItem(STORAGE_KEY);
    if (!persisted) return { tags: defaultTags, noteTags: [], feedback: [] };
    const parsed = JSON.parse(persisted) as TagState;
    return {
      tags: parsed.tags ?? defaultTags,
      noteTags: parsed.noteTags ?? [],
      feedback: parsed.feedback ?? []
    };
  } catch (error) {
    console.warn('Failed to load tag state', error);
    return { tags: defaultTags, noteTags: [], feedback: [] };
  }
};

const persistState = (state: TagState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist tag state', error);
  }
};

const initialState: TagState = {
  tags: defaultTags,
  noteTags: [],
  feedback: []
};

type Action =
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: { id: string; data: Partial<Tag> } }
  | { type: 'DELETE_TAG'; payload: { id: string } }
  | { type: 'MERGE_TAGS'; payload: { sourceId: string; targetId: string } }
  | { type: 'RENAME_TAG'; payload: { id: string; name: string } }
  | { type: 'APPLY_TAG'; payload: NoteTag }
  | { type: 'REMOVE_TAG'; payload: { noteId: string; tagId: string } }
  | { type: 'RECORD_FEEDBACK'; payload: TagFeedback };

const tagReducer = (state: TagState, action: Action): TagState => {
  switch (action.type) {
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map((tag) =>
          tag.id === action.payload.id ? { ...tag, ...action.payload.data } : tag
        )
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
          .map((tag) =>
            tag.parentId === action.payload.sourceId
              ? { ...tag, parentId: action.payload.targetId }
              : tag
          )
          .map((tag) =>
            tag.id === action.payload.targetId
              ? {
                  ...tag,
                  usageCount:
                    tag.usageCount +
                    (state.tags.find((item) => item.id === action.payload.sourceId)?.usageCount ?? 0)
                }
              : tag
          ),
        noteTags: state.noteTags.map((item) =>
          item.tagId === action.payload.sourceId
            ? { ...item, tagId: action.payload.targetId }
            : item
        )
      };
    case 'RENAME_TAG':
      return {
        ...state,
        tags: state.tags.map((tag) =>
          tag.id === action.payload.id ? { ...tag, name: action.payload.name } : tag
        )
      };
    case 'APPLY_TAG': {
      const alreadyApplied = state.noteTags.some(
        (item) => item.noteId === action.payload.noteId && item.tagId === action.payload.tagId
      );
      if (alreadyApplied) {
        return state;
      }
      return {
        ...state,
        noteTags: [...state.noteTags, action.payload],
        tags: state.tags.map((tag) =>
          tag.id === action.payload.tagId
            ? { ...tag, usageCount: tag.usageCount + 1 }
            : tag
        )
      };
    }
    case 'REMOVE_TAG':
      return {
        ...state,
        noteTags: state.noteTags.filter(
          (item) => !(item.noteId === action.payload.noteId && item.tagId === action.payload.tagId)
        ),
        tags: state.tags.map((tag) =>
          tag.id === action.payload.tagId && tag.usageCount > 0
            ? { ...tag, usageCount: Math.max(0, tag.usageCount - 1) }
            : tag
        )
      };
    case 'RECORD_FEEDBACK':
      return { ...state, feedback: [...state.feedback, action.payload] };
    default:
      return state;
  }
};

type TagActions = {
  addTag: (input: CreateTagInput) => Tag;
  updateTag: (id: string, data: UpdateTagInput) => void;
  deleteTag: (id: string) => void;
  mergeTags: (sourceId: string, targetId: string) => void;
  renameTag: (id: string, name: string) => void;
  applyTag: (noteId: string, tagId: string, source: NoteTag['source']) => void;
  removeTag: (noteId: string, tagId: string) => void;
  recordFeedback: (input: { tagId: string; accepted: boolean; noteId: string }) => void;
};

type TagStoreContextValue = {
  state: TagState;
  actions: TagActions;
  notes: Note[];
};

const TagStoreContext = createContext<TagStoreContextValue | undefined>(undefined);

export const TagStoreProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(tagReducer, initialState, () => {
    if (typeof window === 'undefined') {
      return initialState;
    }
    return loadState();
  });

  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

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

  const actions = useMemo<TagActions>(() => ({
    addTag: (input) => {
      const parsed = createTagSchema.parse(input);
      const newTag: Tag = {
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
      const noteTag: NoteTag = {
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
      const feedback: TagFeedback = {
        tagId,
        accepted,
        noteId,
        feedbackAt: Date.now()
      };
      dispatch({ type: 'RECORD_FEEDBACK', payload: feedback });
    }
  }), []);

  const value = useMemo(
    () => ({
      state,
      actions,
      notes
    }),
    [state, actions, notes]
  );

  return <TagStoreContext.Provider value={value}>{children}</TagStoreContext.Provider>;
};

export const useTagStoreContext = () => {
  const context = useContext(TagStoreContext);
  if (!context) {
    throw new Error('useTagStoreContext must be used within TagStoreProvider');
  }
  return context;
};
