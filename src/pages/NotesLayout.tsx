import { useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { NotesList } from '../components/NotesList';
import { NoteEditor } from '../components/NoteEditor';
import { useCreateNote, useNotes, useNote, useUpdateNote } from '../hooks/useNotes';
import { Note } from '../types/note';

const EmptyState = () => (
  <div className="flex h-full items-center justify-center text-center text-slate-400">
    <div>
      <p className="text-lg font-semibold">Select a note to start editing</p>
      <p className="mt-2 text-sm">Or create a new note from the list.</p>
    </div>
  </div>
);

const NoteRoute = () => {
  const { noteId } = useParams();
  const note = useNote(noteId ?? '');
  const updateNote = useUpdateNote();

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <div>
          <p className="text-lg font-semibold">Note not found</p>
          <Link to=".." className="mt-2 inline-block text-primary">
            Go back to notes list
          </Link>
        </div>
      </div>
    );
  }

  return <NoteEditor key={note.id} note={note} onChange={updateNote} />;
};

export const NotesLayout = () => {
  const notes = useNotes();
  const navigate = useNavigate();
  const createNote = useCreateNote();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes;
    }
    const query = searchQuery.trim().toLowerCase();
    return notes.filter((note) =>
      note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleCreateNote = async () => {
    const newNote: Note = await createNote({
      title: 'Untitled Note',
      content: '',
      pinned: false
    });
    navigate(`/notes/${newNote.id}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="flex w-96 flex-col border-r border-surface-border bg-surface-muted">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Your Notes</h1>
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/80"
            onClick={handleCreateNote}
            aria-label="Create a new note"
          >
            New
          </button>
        </div>
        <div className="px-6">
          <label className="sr-only" htmlFor="notes-search">
            Search notes
          </label>
          <input
            id="notes-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search notes..."
            className="mb-4 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NotesList notes={filteredNotes} />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-surface p-8">
        <Routes>
          <Route index element={<EmptyState />} />
          <Route path=":noteId" element={<NoteRoute />} />
        </Routes>
      </main>
    </div>
  );
};
