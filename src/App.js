// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Import your components
import Projects from './pages/Projects';
import About from './pages/About';
import Blog from './pages/Blog';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './components/admin/Login';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

function App() {
  console.log('App is mounting'); // Add this line

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-950">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Projects />} /> {/* This is the home page */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;