import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}
ReactDOM.createRoot(rootElement).render(_jsxs(React.StrictMode, { children: [_jsx(App, {}), "codex/implement-task-management-integration-feature import App from './App'; import './styles/index.css'; import ", TasksProvider, " from './context/TasksContext'; import ", NotesProvider, " from './modules/notes/NotesContext'; ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(", _jsxs(React.StrictMode, { children: [_jsx(NotesProvider, { children: _jsx(TasksProvider, { children: _jsx(App, {}) }) }), "import ", BrowserRouter, " from 'react-router-dom'; import App from './App'; import './styles/index.css'; import ", NotesProvider, " from './context/NotesContext'; ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(", _jsxs(React.StrictMode, { children: [_jsx(BrowserRouter, { children: _jsx(NotesProvider, { children: _jsx(App, {}) }) }), "main"] }), ");"] })] }));
