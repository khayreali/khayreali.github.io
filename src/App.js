import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';

// Import components
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './components/admin/Login';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, signOut } = useAuth();

  useEffect(() => {
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem('sessionStart');
      if (sessionStart) {
        const sessionAge = Date.now() - parseInt(sessionStart);
        if (sessionAge > 30 * 60 * 1000) {
          signOut();
          return;
        }
      }
    };

    const interval = setInterval(checkSession, 60000);
    window.addEventListener('focus', checkSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkSession);
    };
  }, [signOut]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <p className="italic" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    sessionStorage.clear();
    return <Navigate to="/admin/login" />;
  }

  return children;
};

const MetaTagsManager = () => {
  const location = useLocation();

  useEffect(() => {
    const existingRobotsMeta = document.querySelector('meta[name="robots"]');
    if (existingRobotsMeta) {
      existingRobotsMeta.remove();
    }

    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';

    if (location.pathname.includes('/admin/')) {
      robotsMeta.content = 'noindex, nofollow';
    } else {
      robotsMeta.content = 'index, follow';
    }

    document.head.appendChild(robotsMeta);

    return () => {
      if (robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }
    };
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Router>
        <ModalProvider>
          <AuthProvider>
            <MetaTagsManager />
            <Routes>
              {/* Single-page site */}
              <Route path="/" element={<Home />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ModalProvider>
      </Router>
    </div>
  );
}

export default App;
