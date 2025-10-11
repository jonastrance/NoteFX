import { useMemo, useState } from 'react';
import { TagEditor } from './components/TagEditor';
import { TagsList } from './components/TagsList';
import { TagSuggestions } from './components/TagSuggestions';
import { NotesBoard } from './components/NotesBoard';
import { TagAnalytics } from './components/TagAnalytics';
import { TagStoreProvider } from './context/TagStoreProvider';
import { NotesProvider } from './context/NotesProvider';
import { useTags } from './hooks/useTags';
import { cn } from './utils/cn';

const AppContent = () => {
  const { tags, stats } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const selectedTag = useMemo(
    () => tags.find((tag) => tag.id === selectedTagId) ?? null,
    [tags, selectedTagId]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          AI-Powered Tagging
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Smart tagging system that automatically suggests categories, tracks usage and lets you build a knowledge graph of your notes.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          <div className={cn('rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur')}
          >
            <TagEditor activeTag={selectedTag} onDone={() => setSelectedTagId(null)} />
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur">
            <TagAnalytics stats={stats} />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur">
          <TagsList tags={tags} onSelect={setSelectedTagId} selectedId={selectedTagId} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur">
          <NotesBoard />
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur">
          <TagSuggestions />
        </div>
      </section>
    </div>
  );
};

const App = () => {
  return (
    <TagStoreProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </TagStoreProvider>
  );
};

export default App;
