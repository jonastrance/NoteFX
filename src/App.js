import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { mockAnalyticsData } from './lib/mockData';
const App = () => (_jsx("main", { className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10", children: _jsx("div", { className: "mx-auto max-w-7xl", children: _jsx(AnalyticsDashboard, { data: mockAnalyticsData }) }) }));
export default App;
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
    const [selectedTagId, setSelectedTagId] = useState(null);
    const selectedTag = useMemo(() => tags.find((tag) => tag.id === selectedTagId) ?? null, [tags, selectedTagId]);
    return (_jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-8 p-6", children: [_jsxs("header", { className: "flex flex-col gap-2", children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight text-white", children: "AI-Powered Tagging" }), _jsx("p", { className: "max-w-2xl text-sm text-slate-300", children: "Smart tagging system that automatically suggests categories, tracks usage and lets you build a knowledge graph of your notes." })] }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-[2fr_3fr]", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: cn('rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur'), children: _jsx(TagEditor, { activeTag: selectedTag, onDone: () => setSelectedTagId(null) }) }), _jsx("div", { className: "rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur", children: _jsx(TagAnalytics, { stats: stats }) })] }), _jsx("div", { className: "rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur", children: _jsx(TagsList, { tags: tags, onSelect: setSelectedTagId, selectedId: selectedTagId }) })] }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-[3fr_2fr]", children: [_jsx("div", { className: "rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur", children: _jsx(NotesBoard, {}) }), _jsx("div", { className: "rounded-xl border border-white/5 bg-slate-900/60 p-6 shadow-card backdrop-blur", children: _jsx(TagSuggestions, {}) })] })] }));
};
const App = () => {
    return (_jsx(TagStoreProvider, { children: _jsx(NotesProvider, { children: _jsx(AppContent, {}) }) }));
    codex / implement - task - management - integration - feature;
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
        const [selectedNoteId, setSelectedNoteId] = useState(null);
        const [filter, setFilter] = useState({
            status: 'all',
            priority: 'all',
            due: 'all'
        });
        const [sortBy, setSortBy] = useState('dueDate');
        const [editingTaskId, setEditingTaskId] = useState(null);
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
        const editingTask = useMemo(() => (editingTaskId ? tasks.find((task) => task.id === editingTaskId) ?? null : null), [editingTaskId, tasks]);
        const handleTaskSubmit = (payload) => {
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
        return (_jsx("div", { className: "min-h-screen bg-slate-100", children: _jsxs("div", { className: "mx-auto max-w-6xl px-6 py-10", children: [_jsxs("header", { className: "mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Modern Notes Task Management" }), _jsx("p", { className: "text-sm text-slate-600", children: "Organize your notes and tasks with deadlines, priorities, and intelligent reminders." })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("label", { htmlFor: "note-selector", className: "sr-only", children: "Select note" }), _jsxs("select", { id: "note-selector", value: selectedNoteId ?? '', onChange: (event) => setSelectedNoteId(event.target.value || null), className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20", children: [_jsx("option", { value: "", children: "All notes" }), notes.map((note) => (_jsx("option", { value: note.id, children: note.title }, note.id)))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "sort-by", className: "text-sm text-slate-600", children: "Sort by" }), _jsxs("select", { id: "sort-by", className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20", value: sortBy, onChange: (event) => setSortBy(event.target.value), children: [_jsx("option", { value: "dueDate", children: "Due date" }), _jsx("option", { value: "priority", children: "Priority" }), _jsx("option", { value: "createdAt", children: "Creation date" })] })] })] })] }), _jsx(NotificationCenter, { tasks: tasks }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-[2fr,1fr]", children: [_jsx("section", { "aria-labelledby": "tasks-heading", className: "space-y-4", children: _jsxs("div", { className: "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [_jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [_jsx("h2", { id: "tasks-heading", className: "text-xl font-semibold text-slate-900", children: "Tasks" }), _jsx(TaskFilter, { value: filter, onChange: setFilter })] }), _jsx(TasksList, { tasks: filteredTasks, onEditTask: (taskId) => setEditingTaskId(taskId), onDeleteTask: deleteTask, onToggleComplete: (taskId, completed) => updateTask(taskId, { status: completed ? 'completed' : 'pending' }) })] }) }), _jsxs("aside", { className: "space-y-4", children: [_jsxs("section", { "aria-labelledby": "editor-heading", className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [_jsx("h2", { id: "editor-heading", className: "text-xl font-semibold text-slate-900", children: editingTask ? 'Edit task' : 'Create task' }), _jsx(TaskEditor, { notes: notes, initialTask: editingTask ?? undefined, onSubmit: handleTaskSubmit, onCancel: () => setEditingTaskId(null) }, editingTask?.id ?? 'new')] }), _jsx(TaskStatistics, { tasks: tasks })] })] })] }) }));
    }
    import { Navigate, Route, Routes } from 'react-router-dom';
    import { NotesLayout } from './pages/NotesLayout';
    const App = () => {
        return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/notes", replace: true }) }), _jsx(Route, { path: "/notes/*", element: _jsx(NotesLayout, {}) })] }));
    };
    export default App;
    main;
};
