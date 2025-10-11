import { Link, useLocation } from 'react-router-dom';
import { Note } from '../types/note';
import { useDeleteNote, useUpdateNote } from '../hooks/useNotes';
import { formatRelativeTime } from '../lib/formatRelativeTime';
import { cn } from '../lib/utils';

interface NotesListProps {
  notes: Note[];
}

export const NotesList = ({ notes }: NotesListProps) => {
  const location = useLocation();
  const deleteNote = useDeleteNote();
  const updateNote = useUpdateNote();

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (sortedNotes.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-slate-400">No notes yet. Create your first note!</p>
    );
  }

  return (
    <ul className="space-y-2 px-4 pb-6">
      {sortedNotes.map((note) => {
        const isActive = location.pathname.endsWith(note.id);
        return (
          <li key={note.id}>
            <article
              className={cn(
                'group relative overflow-hidden rounded-lg border border-transparent bg-surface px-4 py-3 transition hover:border-primary/40 hover:bg-surface/80',
                isActive && 'border-primary bg-surface/80'
              )}
            >
              <Link to={`/notes/${note.id}`} className="block">
                <div className="flex items-start justify-between">
                  <h2 className="max-w-[12rem] truncate text-sm font-semibold text-white">
                    {note.title || 'Untitled'}
                  </h2>
                  {note.pinned && (
                    <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="mt-2 max-h-12 overflow-hidden text-xs text-slate-400 whitespace-pre-wrap">
                  {note.content || 'Empty note'}
                </p>
                <time className="mt-3 block text-[0.7rem] uppercase tracking-wide text-slate-500">
                  Updated {formatRelativeTime(note.updatedAt)}
                </time>
              </Link>
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <button
                  type="button"
                  className="rounded px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-surface-border/30"
                  onClick={() => {
                    void updateNote(note.id, { pinned: !note.pinned });
                  }}
                  aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  onClick={() => {
                    void deleteNote(note.id);
                  }}
                  aria-label="Delete note"
                >
                  Delete
                </button>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
};
