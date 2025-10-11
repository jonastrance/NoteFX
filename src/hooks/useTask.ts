import { useMemo } from 'react';
import { useTasksContext } from '../context/TasksContext';

export function useTask(taskId: string) {
  const { tasks } = useTasksContext();
  return useMemo(() => tasks.find((task) => task.id === taskId), [tasks, taskId]);
}
