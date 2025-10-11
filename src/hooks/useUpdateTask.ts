import { useTasksContext } from '../context/TasksContext';

export function useUpdateTask() {
  const { updateTask } = useTasksContext();
  return updateTask;
}
