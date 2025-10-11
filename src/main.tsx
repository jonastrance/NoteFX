import React from 'react';
import ReactDOM from 'react-dom/client';
codex/implement-task-management-integration-feature
import App from './App';
import './styles/index.css';
import { TasksProvider } from './context/TasksContext';
import { NotesProvider } from './modules/notes/NotesContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotesProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </NotesProvider>
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { NotesProvider } from './context/NotesContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotesProvider>
        <App />
      </NotesProvider>
    </BrowserRouter>
main
  </React.StrictMode>
);
