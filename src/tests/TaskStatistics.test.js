import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { TaskStatistics } from '../components/TaskStatistics';
const baseTask = {
    id: '1',
    title: 'Task 1',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
};
describe('TaskStatistics', () => {
    it('renders aggregate data', () => {
        const tasks = [
            { ...baseTask, id: '1', title: 'Task 1', dueDate: new Date('2024-01-05').toISOString() },
            {
                ...baseTask,
                id: '2',
                title: 'Task 2',
                status: 'completed',
                dueDate: new Date('2024-01-04').toISOString(),
                updatedAt: new Date('2024-01-03').toISOString()
            }
        ];
        render(_jsx(TaskStatistics, { tasks: tasks }));
        expect(screen.getByText('Total tasks').parentElement).toHaveTextContent('2');
        expect(screen.getByText('Completion rate').parentElement).toHaveTextContent('50%');
        expect(screen.getByText('Overdue tasks').parentElement).toBeInTheDocument();
    });
});
