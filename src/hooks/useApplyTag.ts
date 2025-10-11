import { useCallback } from 'react';
import { useTags } from './useTags';
import { useNotesContext } from '../context/NotesProvider';

export const useApplyTag = () => {
  const { applyTag, removeTag, recordFeedback } = useTags();
  const { selectedNoteId } = useNotesContext();

  const toggleTag = useCallback(
    (tagId: string, source: 'manual' | 'ai' = 'manual', accepted = true) => {
      if (!selectedNoteId) return;
      applyTag(selectedNoteId, tagId, source);
      recordFeedback({ tagId, accepted, noteId: selectedNoteId });
    },
    [applyTag, recordFeedback, selectedNoteId]
  );

  const unassign = useCallback(
    (tagId: string) => {
      if (!selectedNoteId) return;
      removeTag(selectedNoteId, tagId);
      recordFeedback({ tagId, accepted: false, noteId: selectedNoteId });
    },
    [recordFeedback, removeTag, selectedNoteId]
  );

  return { apply: toggleTag, remove: unassign };
};
