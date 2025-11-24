import { useTasksContext } from '../context/TasksContext';
export function useDeleteTask() {
    const { deleteTask } = useTasksContext();
    return deleteTask;
}
