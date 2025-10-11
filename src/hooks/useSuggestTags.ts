import { useMemo } from 'react';
import { suggestTagsForNote } from '../lib/aiTagEngine';
import { useTagStoreContext } from '../context/TagStoreProvider';
import { useNotesContext } from '../context/NotesProvider';

export const useSuggestTags = () => {
  const { state } = useTagStoreContext();
  const { notes, selectedNoteId } = useNotesContext();

  const note = useMemo(() => notes.find((item) => item.id === selectedNoteId), [
    notes,
    selectedNoteId
  ]);

  const suggestions = useMemo(() => {
    if (!note) return [];
    return suggestTagsForNote({
      note,
      tags: state.tags,
      assignments: state.noteTags.filter((item) => item.noteId === note.id),
      feedback: state.feedback
    });
  }, [note, state.tags, state.noteTags, state.feedback]);

  return { note, suggestions };
};
