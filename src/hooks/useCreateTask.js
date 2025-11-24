import { useTasksContext } from '../context/TasksContext';
export function useCreateTask() {
    const { createTask } = useTasksContext();
    return createTask;
}
