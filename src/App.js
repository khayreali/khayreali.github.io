import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Import your components
import Projects from './pages/Projects';
import ProjectPost from './pages/ProjectPost';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './components/admin/Login';

const StarryBackground = React.memo(() => {
  const stars = [...Array(100)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 4 + 1}px`,
    animation: `twinkle ${Math.random() * 3 + 2}s infinite`
  }));

  return (
    <div className="fixed inset-0 opacity-50 pointer-events-none" style={{ zIndex: 10 }}>
      {stars.map((style, i) => (
        <div
          key={i}
          className="absolute bg-[#63B3ED] rounded-full"
          style={style}
        />
      ))}
    </div>
  );
});

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, signOut } = useAuth();
  
  useEffect(() => {
    // Check session timeout (30 minutes)
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem('sessionStart');
      if (sessionStart) {
        const sessionAge = Date.now() - parseInt(sessionStart);
        if (sessionAge > 30 * 60 * 1000) { // 30 minutes
          signOut();
          return;
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    window.addEventListener('focus', checkSession); // Check when tab becomes active

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkSession);
    };
  }, [signOut]);

  // Handle tab/window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    // Clear any existing session data
    sessionStorage.clear();
    return <Navigate to="/admin/login" />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Prevent indexing of admin routes
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);

    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1620] relative">
      <StarryBackground />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Projects />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Route */}
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
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;