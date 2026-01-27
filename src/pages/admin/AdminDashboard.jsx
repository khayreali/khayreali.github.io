import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProjectEditor from '../../components/admin/ProjectEditor';
import DashboardHome from '../../components/admin/DashboardHome';
import AboutEditor from '../../components/admin/AboutEditor';
import IdeaEditor from '../../components/admin/IdeaEditor';

const AdminDashboard = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  // Update session timestamp on any admin activity
  useEffect(() => {
    sessionStorage.setItem('sessionStart', Date.now().toString());
  }, []);

  const handleSignOut = async () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutUntil');
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Automatically update session timestamp on user activity
  useEffect(() => {
    const updateSessionTimestamp = () => {
      sessionStorage.setItem('sessionStart', Date.now().toString());
    };

    // Update on user activity
    window.addEventListener('mousemove', updateSessionTimestamp);
    window.addEventListener('keydown', updateSessionTimestamp);
    window.addEventListener('click', updateSessionTimestamp);
    window.addEventListener('scroll', updateSessionTimestamp);

    return () => {
      window.removeEventListener('mousemove', updateSessionTimestamp);
      window.removeEventListener('keydown', updateSessionTimestamp);
      window.removeEventListener('click', updateSessionTimestamp);
      window.removeEventListener('scroll', updateSessionTimestamp);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <nav
        className="border-b p-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link
              to="/admin"
              className="sans transition-colors hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/projects"
              className="sans transition-colors hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              Projects
            </Link>
            <Link
              to="/admin/about"
              className="sans transition-colors hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              About
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <span className="sans text-sm" style={{ color: 'var(--text-muted)' }}>
              {currentUser?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-5 py-2 rounded-md sans text-sm transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/editor/:id" element={<IdeaEditor />} />
          <Route path="/projects" element={<ProjectEditor />} />
          <Route path="/projects/edit/:id" element={<ProjectEditor />} />
          <Route path="/about" element={<AboutEditor />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
