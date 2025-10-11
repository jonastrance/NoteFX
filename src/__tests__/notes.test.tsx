import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NotesProvider } from '../context/NotesContext';
import { NotesLayout } from '../pages/NotesLayout';
import { vi } from 'vitest';

describe('Notes application', () => {
  const setup = (initialEntries = ['/notes']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <NotesProvider>
          <Routes>
            <Route path="/notes/*" element={<NotesLayout />} />
          </Routes>
        </NotesProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates a new note and auto saves title/content', async () => {
    vi.useFakeTimers();
    setup();

    const createButton = screen.getByRole('button', { name: /new/i });
    await userEvent.click(createButton);

    const titleInput = await screen.findByLabelText(/note title/i);
    expect(titleInput).toHaveValue('Untitled Note');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Project Plan');

    await vi.advanceTimersByTimeAsync(650);

    const contentInput = screen.getByLabelText(/note content editor/i);
    await userEvent.type(contentInput, 'Initial ideas');

    await vi.advanceTimersByTimeAsync(650);

    await waitFor(() => {
      expect(screen.getByText(/project plan/i)).toBeInTheDocument();
      expect(screen.getByText(/initial ideas/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('filters notes by search query', async () => {
    vi.useFakeTimers();
    setup();

    await userEvent.click(screen.getByRole('button', { name: /new/i }));
    const titleInput = await screen.findByLabelText(/note title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Daily Journal');
    await vi.advanceTimersByTimeAsync(700);

    await userEvent.click(screen.getByRole('button', { name: /new/i }));
    const secondTitle = await screen.findByLabelText(/note title/i);
    await userEvent.clear(secondTitle);
    await userEvent.type(secondTitle, 'Meeting Notes');
    await vi.advanceTimersByTimeAsync(700);

    const searchInput = screen.getByPlaceholderText(/search notes/i);
    await userEvent.type(searchInput, 'Meeting');

    await waitFor(() => {
      expect(screen.getByText(/meeting notes/i)).toBeInTheDocument();
      expect(screen.queryByText(/daily journal/i)).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('pins notes and reorders the list', async () => {
    vi.useFakeTimers();
    setup();

    await userEvent.click(screen.getByRole('button', { name: /new/i }));
    const firstTitle = await screen.findByLabelText(/note title/i);
    await userEvent.clear(firstTitle);
    await userEvent.type(firstTitle, 'First Note');
    await vi.advanceTimersByTimeAsync(650);

    await userEvent.click(screen.getByRole('button', { name: /new/i }));
    const secondTitle = await screen.findByLabelText(/note title/i);
    await userEvent.clear(secondTitle);
    await userEvent.type(secondTitle, 'Second Note');
    await vi.advanceTimersByTimeAsync(650);

    const secondCard = screen.getByText(/second note/i).closest('article');
    expect(secondCard).not.toBeNull();
    const pinButton = within(secondCard as HTMLElement).getByRole('button', { name: /pin note/i });
    await userEvent.click(pinButton);
    await vi.advanceTimersByTimeAsync(20);

    const noteCards = screen.getAllByRole('article');
    expect(noteCards[0]).toHaveTextContent(/second note/i);

    vi.useRealTimers();
  });
});
