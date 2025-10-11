import { Navigate, Route, Routes } from 'react-router-dom';
import { NotesLayout } from './pages/NotesLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route path="/notes/*" element={<NotesLayout />} />
    </Routes>
  );
};

export default App;
