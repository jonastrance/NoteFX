import { useMemo, useState } from 'react';
import { Edit3, NotebookPen, Search } from 'lucide-react';
import { useNotesContext } from '../context/NotesProvider';
import { useTags } from '../hooks/useTags';
import { useApplyTag } from '../hooks/useApplyTag';
import { TagBadge } from './TagBadge';
import { cn } from '../utils/cn';
import { dateFormatCache } from '../utils/dateFormatCache';

export const NotesBoard = () => {
  const { notes, selectedNoteId, selectNote, updateNoteContent } = useNotesContext();
  const { tags, noteTags } = useTags();
  const { apply, remove } = useApplyTag();
  const [manualQuery, setManualQuery] = useState('');

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  const assignedTags = useMemo(
    () =>
      noteTags
        .filter((item) => item.noteId === selectedNoteId)
        .map((assignment) => tags.find((tag) => tag.id === assignment.tagId))
        .filter(Boolean),
    [noteTags, selectedNoteId, tags]
  );

  const availableManualTags = useMemo(() => {
    const lower = manualQuery.toLowerCase();
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(lower) &&
      !assignedTags.some((assigned) => assigned?.id === tag.id)
    );
  }, [tags, manualQuery, assignedTags]);

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
          <NotebookPen className="h-4 w-4 text-sky-300" aria-hidden />
          Notes
        </h2>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id}>
              <button
                onClick={() => selectNote(note.id)}
                className={cn(
                  'w-full rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-left text-sm transition hover:border-sky-400/40',
                  note.id === selectedNoteId && 'border-sky-400/80 bg-sky-500/10 text-white'
                )}
              >
                <p className="font-semibold">{note.title}</p>
                <p className="text-xs text-slate-400">
                  {dateFormatCache.formatDate(note.updatedAt)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        {selectedNote ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedNote.title}</h3>
                <span className="text-xs uppercase tracking-widest text-slate-500">
                  Last updated {dateFormatCache.formatDateTime(selectedNote.updatedAt)}
                </span>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Note content
                </span>
                <textarea
                  value={selectedNote.content}
                  onChange={(event) => updateNoteContent(selectedNote.id, event.target.value)}
                  className="h-40 w-full rounded-lg border border-white/5 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40"
                />
              </label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Applied tags
                </h4>
                <Edit3 className="h-4 w-4 text-slate-500" aria-hidden />
              </div>
              <div className="flex flex-wrap gap-2">
                {assignedTags.length === 0 ? (
                  <p className="text-sm text-slate-400">No tags applied yet.</p>
                ) : (
                  assignedTags.map((tag) => (
                    <TagBadge key={tag!.id} tag={tag!} onRemove={() => remove(tag!.id)} />
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Manual override
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={manualQuery}
                  onChange={(event) => setManualQuery(event.target.value)}
                  placeholder="Search tags to apply..."
                  className="w-full rounded-lg border border-white/5 bg-slate-950/60 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40"
                />
              </div>
              {manualQuery && (
                <ul className="max-h-40 space-y-2 overflow-y-auto">
                  {availableManualTags.length === 0 ? (
                    <li className="text-xs text-slate-500">No tags match that search.</li>
                  ) : (
                    availableManualTags.map((tag) => (
                      <li key={tag.id}>
                        <button
                          onClick={() => {
                            apply(tag.id, 'manual', true);
                            setManualQuery('');
                          }}
                          className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-emerald-400/40"
                        >
                          <span>{tag.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-slate-500">
                            Apply
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">Select a note to start tagging.</p>
        )}
      </div>
    </div>
  );
};
