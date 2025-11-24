import { jsx as _jsx } from "react/jsx-runtime";
import { fireEvent, render, screen } from '@testing-library/react';
import { TaskEditor } from '../components/TaskEditor';
const notes = [
    { id: '11111111-1111-4111-8111-111111111111', title: 'Product strategy' },
    { id: '22222222-2222-4222-8222-222222222222', title: 'Personal goals' }
];
describe('TaskEditor', () => {
    it('submits with the expected payload', () => {
        const handleSubmit = vi.fn();
        render(_jsx(TaskEditor, { notes: notes, onSubmit: handleSubmit, onCancel: vi.fn() }));
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Ship release' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Coordinate release tasks' } });
        fireEvent.change(screen.getByLabelText(/due date/i), {
            target: { value: '2030-01-01T10:00' }
        });
        fireEvent.change(screen.getByLabelText(/link to note/i), { target: { value: notes[0].id } });
        fireEvent.click(screen.getByLabelText(/high/i));
        fireEvent.click(screen.getByRole('button', { name: /weekly/i }));
        fireEvent.change(screen.getByLabelText(/every/i).querySelector('input'), { target: { value: '2' } });
        fireEvent.click(screen.getByRole('button', { name: /add reminder/i }));
        fireEvent.change(screen.getByDisplayValue('60'), { target: { value: '120' } });
        fireEvent.click(screen.getByRole('button', { name: /create task/i }));
        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Ship release',
            description: 'Coordinate release tasks',
            noteId: notes[0].id,
            recurrence: { pattern: 'weekly', interval: 2 },
            reminders: [{ minutesBefore: 120 }]
        }));
    });
});
