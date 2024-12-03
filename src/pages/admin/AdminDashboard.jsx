import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BlogEditor from '../../components/admin/BlogEditor';
import ProjectEditor from '../../components/admin/ProjectEditor';
import DashboardHome from '../../components/admin/DashboardHome';
import AboutEditor from '../../components/admin/AboutEditor';

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
   <div className="min-h-screen bg-[#0F1620]">
     <nav className="bg-[#131E2B] border-b border-[#2C5282]/20 p-4">
       <div className="container mx-auto flex justify-between items-center">
         <div className="flex items-center space-x-8">
           <Link to="/admin" className="text-[#63B3ED] hover:text-white transition-colors duration-300 font-['Space_Grotesk']">
             Dashboard
           </Link>
           <Link to="/admin/projects" className="text-[#63B3ED] hover:text-white transition-colors duration-300 font-['Space_Grotesk']">
             Projects
           </Link>
           <Link to="/admin/blog" className="text-[#63B3ED] hover:text-white transition-colors duration-300 font-['Space_Grotesk']">
             Blog Posts
           </Link>
           <Link to="/admin/about" className="text-[#63B3ED] hover:text-white transition-colors duration-300 font-['Space_Grotesk']">
             About Page
           </Link>
         </div>
         <div className="flex items-center space-x-6">
           <span className="text-gray-300 font-['Space_Grotesk']">{currentUser?.email}</span>
           <button
             onClick={handleSignOut}
             className="px-6 py-2 bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white rounded-lg 
                      transition-all duration-300 font-['Space_Grotesk'] relative overflow-hidden group"
           >
             <span className="relative z-10">Sign Out</span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
           </button>
         </div>
       </div>
     </nav>
     
     <main className="container mx-auto p-8">
       <Routes>
         <Route index element={<DashboardHome />} />
         <Route path="projects" element={<ProjectEditor />} />
         <Route path="blog" element={<BlogEditor />} />
         <Route path="about" element={<AboutEditor />} />
       </Routes>
     </main>
   </div>
 );
};

export default AdminDashboard;