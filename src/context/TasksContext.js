import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { taskSchema } from '../utils/taskSchema';
import { createRecurringInstance } from '../utils/recurrence';
import { loadTasks, persistTasks } from '../utils/storage';
const TasksContext = createContext(undefined);
function ensureUUID() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
}
export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        setTasks(loadTasks());
    }, []);
    useEffect(() => {
        persistTasks(tasks);
    }, [tasks]);
    const getTaskById = useCallback((taskId) => tasks.find((task) => task.id === taskId), [tasks]);
    const createTask = useCallback((input) => {
        const parsed = taskSchema.parse({
            ...input,
            dueDate: input.dueDate ?? null,
            noteId: input.noteId ?? null,
            recurrence: input.recurrence ?? null,
            reminders: input.reminders ?? []
        });
        const now = new Date().toISOString();
        const task = {
            ...parsed,
            id: ensureUUID(),
            createdAt: now,
            updatedAt: now
        };
        setTasks((prev) => [...prev, task]);
        return task;
    }, []);
    const updateTask = useCallback((taskId, updates) => {
        let updatedTask = null;
        let createdRecurringTask = null;
        setTasks((prev) => {
            const index = prev.findIndex((task) => task.id === taskId);
            if (index === -1) {
                return prev;
            }
            const existing = prev[index];
            const merged = {
                ...existing,
                ...updates,
                dueDate: updates.dueDate ?? existing.dueDate ?? null,
                noteId: updates.noteId ?? existing.noteId ?? null,
                recurrence: updates.recurrence ?? existing.recurrence ?? null,
                reminders: updates.reminders ?? existing.reminders ?? []
            };
            const parsed = taskSchema.parse(merged);
            updatedTask = {
                ...existing,
                ...parsed,
                updatedAt: new Date().toISOString()
            };
            if (existing.status !== 'completed' && parsed.status === 'completed') {
                createdRecurringTask = createRecurringInstance(updatedTask);
            }
            const next = [...prev];
            next[index] = updatedTask;
            if (createdRecurringTask) {
                next.push(createdRecurringTask);
            }
            return next;
        });
        return updatedTask;
    }, []);
    const deleteTask = useCallback((taskId) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }, []);
    const value = useMemo(() => ({
        tasks,
        createTask,
        updateTask,
        deleteTask,
        getTaskById
    }), [tasks, createTask, updateTask, deleteTask, getTaskById]);
    return _jsx(TasksContext.Provider, { value: value, children: children });
}
export function useTasksContext() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasksContext must be used within a TasksProvider');
    }
    return context;
}
