import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      {children}
    </div>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <AppLayout>
            <Projects />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <AppLayout>
            <Tasks />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <ProjectDetail />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
