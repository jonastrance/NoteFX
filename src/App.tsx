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
codex/implement-task-management-integration-feature
import { useMemo, useState } from 'react';
import { TaskEditor } from './components/TaskEditor';
import { TasksList } from './components/TasksList';
import { TaskFilter, TaskFilterState } from './components/TaskFilter';
import { TaskStatistics } from './components/TaskStatistics';
import { useTasks } from './hooks/useTasks';
import { useNotes } from './modules/notes/useNotes';
import { sortTasks } from './utils/sortTasks';
import { TaskSortOption } from './utils/taskTypes';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { notes } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilterState>({
    status: 'all',
    priority: 'all',
    due: 'all'
  });
  const [sortBy, setSortBy] = useState<TaskSortOption>('dueDate');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const tasksForNote = selectedNoteId
      ? tasks.filter((task) => task.noteId === selectedNoteId)
      : tasks;

    const filtered = tasksForNote.filter((task) => {
      if (filter.status !== 'all' && task.status !== filter.status) {
        return false;
      }
      if (filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }
      if (filter.due !== 'all') {
        if (filter.due === 'overdue' && (!task.dueDate || new Date(task.dueDate) >= new Date())) {
          return false;
        }
        if (filter.due === 'upcoming' && (!task.dueDate || new Date(task.dueDate) < new Date())) {
          return false;
        }
      }
      return true;
    });

    return sortTasks(filtered, sortBy);
  }, [tasks, selectedNoteId, filter, sortBy]);

  const editingTask = useMemo(
    () => (editingTaskId ? tasks.find((task) => task.id === editingTaskId) ?? null : null),
    [editingTaskId, tasks]
  );

  const handleTaskSubmit = (payload: Parameters<typeof createTask>[0]) => {
    if (editingTaskId) {
      updateTask(editingTaskId, payload);
      setEditingTaskId(null);
      return;
    }

    const newTask = createTask(payload);
    if (!selectedNoteId && newTask.noteId) {
      setSelectedNoteId(newTask.noteId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Modern Notes Task Management</h1>
            <p className="text-sm text-slate-600">
              Organize your notes and tasks with deadlines, priorities, and intelligent reminders.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="note-selector" className="sr-only">
              Select note
            </label>
            <select
              id="note-selector"
              value={selectedNoteId ?? ''}
              onChange={(event) => setSelectedNoteId(event.target.value || null)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All notes</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm text-slate-600">
                Sort by
              </label>
              <select
                id="sort-by"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as TaskSortOption)}
              >
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Creation date</option>
              </select>
            </div>
          </div>
        </header>

        <NotificationCenter tasks={tasks} />

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <section aria-labelledby="tasks-heading" className="space-y-4">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 id="tasks-heading" className="text-xl font-semibold text-slate-900">
                  Tasks
                </h2>
                <TaskFilter value={filter} onChange={setFilter} />
              </div>
              <TasksList
                tasks={filteredTasks}
                onEditTask={(taskId) => setEditingTaskId(taskId)}
                onDeleteTask={deleteTask}
                onToggleComplete={(taskId, completed) =>
                  updateTask(taskId, { status: completed ? 'completed' : 'pending' })
                }
              />
            </div>
          </section>

          <aside className="space-y-4">
            <section aria-labelledby="editor-heading" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 id="editor-heading" className="text-xl font-semibold text-slate-900">
                {editingTask ? 'Edit task' : 'Create task'}
              </h2>
              <TaskEditor
                key={editingTask?.id ?? 'new'}
                notes={notes}
                initialTask={editingTask ?? undefined}
                onSubmit={handleTaskSubmit}
                onCancel={() => setEditingTaskId(null)}
              />
            </section>
            <TaskStatistics tasks={tasks} />
          </aside>
        </div>
      </div>
    </div>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { NotesLayout } from './pages/NotesLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route path="/notes/*" element={<NotesLayout />} />
    </Routes>
  );
};

export default App;
main
