import { jsx as _jsx } from "react/jsx-runtime";
import { act, renderHook } from '@testing-library/react';
import { TasksProvider } from '../context/TasksContext';
import { useTasks } from '../hooks/useTasks';
const wrapper = ({ children }) => _jsx(TasksProvider, { children: children });
const baseTask = {
    title: 'Draft release notes',
    description: 'Compile highlights from the last sprint.',
    status: 'pending',
    priority: 'high',
    dueDate: new Date().toISOString(),
    noteId: '11111111-1111-4111-8111-111111111111',
    recurrence: null
};
describe('TasksProvider', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });
    it('creates, updates, and deletes tasks', () => {
        const { result } = renderHook(() => useTasks(), { wrapper });
        act(() => {
            result.current.createTask(baseTask);
        });
        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe('Draft release notes');
        act(() => {
            result.current.updateTask(result.current.tasks[0].id, { title: 'Updated title' });
        });
        expect(result.current.tasks[0].title).toBe('Updated title');
        act(() => {
            result.current.deleteTask(result.current.tasks[0].id);
        });
        expect(result.current.tasks).toHaveLength(0);
    });
    it('persists tasks to localStorage', () => {
        const { result, unmount } = renderHook(() => useTasks(), { wrapper });
        act(() => {
            result.current.createTask(baseTask);
        });
        unmount();
        const stored = JSON.parse(window.localStorage.getItem('modern-notes-app/tasks') ?? '[]');
        expect(stored).toHaveLength(1);
        expect(stored[0].title).toBe('Draft release notes');
    });
    it('creates a new instance when completing a recurring task', () => {
        const { result } = renderHook(() => useTasks(), { wrapper });
        act(() => {
            result.current.createTask({
                ...baseTask,
                recurrence: { pattern: 'daily', interval: 1 }
            });
        });
        const [task] = result.current.tasks;
        act(() => {
            result.current.updateTask(task.id, { status: 'completed' });
        });
        expect(result.current.tasks.some((t) => t.id !== task.id && t.recurrence)).toBe(true);
    });
});
