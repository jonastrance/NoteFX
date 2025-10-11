import React from 'react';
import ReactDOM from 'react-dom/client';
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
  </React.StrictMode>
);
