import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import UploadCourse from './pages/UploadCourse';
import CourseDetail from './pages/CourseDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'student' | 'trainer' }> = ({ 
  children, 
  role 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/\" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/\" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/\" replace /> : <Register />} 
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/upload"
          element={
            <ProtectedRoute role="trainer">
              <UploadCourse />
            </ProtectedRoute>
          }
        />
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;