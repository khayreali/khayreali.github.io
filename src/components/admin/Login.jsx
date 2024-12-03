import React, { useState } from 'react';
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
 const navigate = useNavigate();
 const { currentUser } = useAuth();

 if (currentUser) return <Navigate to="/admin" />;

 const handleLogin = async (e) => {
   e.preventDefault();
   setError('');
   setLoading(true);
   try {
     await signInWithEmailAndPassword(auth, email, password);
     navigate('/admin');
   } catch (error) {
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
               disabled={loading}
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
               disabled={loading}
             />
           </div>

           <button
             type="submit"
             disabled={loading}
             className={`w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#63B3ED]/90
                       text-white font-medium rounded-lg transition-all duration-300
                       font-['Space_Grotesk'] relative overflow-hidden group
                       ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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