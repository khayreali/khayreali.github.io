// src/components/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); // Redirect to admin dashboard after successful login
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : 'Failed to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-400 text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                          text-gray-200"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                          text-gray-200"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 
                        text-white font-medium rounded-lg transition duration-200
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;