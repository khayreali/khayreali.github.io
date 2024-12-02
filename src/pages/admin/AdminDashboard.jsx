// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BlogEditor from '../../components/admin/BlogEditor';
import ProjectEditor from '../../components/admin/ProjectEditor';

const AdminDashboard = () => {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="text-purple-400 hover:text-purple-300">
              Dashboard
            </Link>
            <Link to="/admin/blog" className="text-purple-400 hover:text-purple-300">
              Blog Posts
            </Link>
            <Link to="/admin/projects" className="text-purple-400 hover:text-purple-300">
              Projects
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{currentUser?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route index element={
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
              <p>Select a section from the navigation menu to get started.</p>
            </div>
          } />
          <Route path="blog" element={<BlogEditor />} />
          <Route path="projects" element={<ProjectEditor />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;