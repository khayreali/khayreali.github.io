import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

const generateStars = () => {
  return [...Array(100)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 4 + 1}px`,
    animation: `twinkle ${Math.random() * 3 + 2}s infinite`
  }));
};

const stars = generateStars();

const StarryBackground = () => (
  <div className="absolute inset-0 opacity-50">
    {stars.map((style, i) => (
      <div
        key={i}
        className="absolute bg-[#63B3ED] rounded-full"
        style={style}
      />
    ))}
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(
    parseInt(localStorage.getItem('loginAttempts') || '0')
  );
  const [lockoutUntil, setLockoutUntil] = useState(
    localStorage.getItem('lockoutUntil') || null
  );
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Clear lockout if time has passed
    if (lockoutUntil && new Date() < new Date(lockoutUntil)) {
      const remainingTime = Math.ceil((new Date(lockoutUntil) - new Date()) / 1000);
      setError(`Too many login attempts. Try again in ${remainingTime} seconds`);
    } else if (lockoutUntil) {
      setLockoutUntil(null);
      setLoginAttempts(0);
      localStorage.removeItem('lockoutUntil');
      localStorage.setItem('loginAttempts', '0');
    }
  }, [lockoutUntil]);

  // Redirect if already logged in
  if (currentUser) {
    // Set session timeout
    sessionStorage.setItem('sessionStart', Date.now().toString());
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if locked out
    if (lockoutUntil && new Date() < new Date(lockoutUntil)) {
      return;
    }

    // Basic password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Reset attempts on successful login
      setLoginAttempts(0);
      localStorage.setItem('loginAttempts', '0');
      localStorage.removeItem('lockoutUntil');
      
      // Set session data
      sessionStorage.setItem('sessionStart', Date.now().toString());
      
      navigate('/admin');
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // Implement exponential backoff for failed attempts
      if (newAttempts >= 3) { // Lock after 3 failed attempts
        const lockoutDuration = Math.min(Math.pow(2, newAttempts - 3) * 30, 1800); // Max 30 minutes
        const lockoutTime = new Date(Date.now() + lockoutDuration * 1000).toISOString();
        setLockoutUntil(lockoutTime);
        localStorage.setItem('lockoutUntil', lockoutTime);
      }

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
    <div className="min-h-screen flex items-center justify-center bg-[#0F1620] relative">
      <StarryBackground />

      <Card className="w-full max-w-md bg-[#131E2B] border border-[#2C5282]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#63B3ED] to-transparent" />
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center font-['Space_Grotesk']">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm font-['Space_Grotesk']">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#63B3ED] font-['Space_Grotesk']">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                          focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                          text-white font-['Space_Grotesk'] transition-all duration-300"
                required
                disabled={loading || (lockoutUntil && new Date() < new Date(lockoutUntil))}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#63B3ED] font-['Space_Grotesk']">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                          focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                          text-white font-['Space_Grotesk'] transition-all duration-300"
                required
                disabled={loading || (lockoutUntil && new Date() < new Date(lockoutUntil))}
              />
            </div>

            <button
              type="submit"
              disabled={loading || (lockoutUntil && new Date() < new Date(lockoutUntil))}
              className={`w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#63B3ED]/90
                        text-white font-medium rounded-lg transition-all duration-300
                        font-['Space_Grotesk'] relative overflow-hidden group
                        ${loading || (lockoutUntil && new Date() < new Date(lockoutUntil)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10">
                {loading ? 'Logging in...' : 'Login'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;