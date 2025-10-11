import { fireEvent, render, screen } from '@testing-library/react';
import { TaskFilter, TaskFilterState } from '../components/TaskFilter';

describe('TaskFilter', () => {
  const baseFilter: TaskFilterState = { status: 'all', priority: 'all', due: 'all' };

  it('invokes onChange when selecting filters', () => {
    const handleChange = vi.fn();
    render(<TaskFilter value={baseFilter} onChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: /pending/i }));
    expect(handleChange).toHaveBeenCalledWith({ ...baseFilter, status: 'pending' });

    fireEvent.click(screen.getByRole('button', { name: /high/i }));
    expect(handleChange).toHaveBeenLastCalledWith({ status: 'pending', priority: 'high', due: 'all' });
  });
});
