import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navibar from './components/Navibar';
import Login from './auth/Login';
import Register from './auth/Register';
import Assignments from './teacher/Assignments';
import Submissions from './student/Submissions';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navibar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher" element={<Assignments />} />
          <Route path="/submissions/student" element={<Submissions />} />
          <Route path="/student" element={<Navigate to="/submissions/student" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;