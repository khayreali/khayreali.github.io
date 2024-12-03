import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Blog = () => {
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchPosts = async () => {
     try {
       const querySnapshot = await getDocs(collection(db, 'blogs'));
       const postsList = querySnapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
       }));
       postsList.sort((a, b) => new Date(b.date) - new Date(a.date));
       setPosts(postsList);
     } catch (error) {
       console.error('Error fetching blog posts:', error);
     } finally {
       setLoading(false);
     }
   };
   fetchPosts();
 }, []);

 return (
   <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
     {/* Animated Background */}
     <div className="absolute inset-0 opacity-50">
       {[...Array(100)].map((_, i) => (
         <div
           key={i}
           className="absolute bg-[#63B3ED] rounded-full"
           style={{
             top: `${Math.random() * 100}%`,
             left: `${Math.random() * 100}%`,
             width: `${Math.random() * 4 + 1}px`,
             height: `${Math.random() * 4 + 1}px`,
             animation: `twinkle ${Math.random() * 3 + 2}s infinite`
           }}
         />
       ))}
     </div>

     <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1620]/90 backdrop-blur-sm">
       <div className="max-w-7xl mx-auto px-8 py-4">
         <ul className="flex space-x-12">
           {['Home', 'About', 'Blog'].map((item) => (
             <li key={item} className="relative group">
               <Link 
                 to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                 className="text-[#63B3ED] hover:text-white transition-all duration-300 font-['Space_Grotesk']"
               >
                 {item}
                 <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#63B3ED] group-hover:w-full transition-all duration-300"/>
               </Link>
             </li>
           ))}
         </ul>
       </div>
     </nav>

     <div className="max-w-7xl mx-auto pt-32 px-8">
       {/* Header */}
       <div className="relative mb-24">
         <h1 className="text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
           Blog
           <span className="text-[#63B3ED]">.</span>
         </h1>
         <div className="absolute -top-8 -left-4 w-24 h-24 border-2 border-[#63B3ED]/20 rounded-full" />
         <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#63B3ED]/40 rounded-full" />
         <div className="absolute -bottom-4 right-1/4 w-12 h-12 border-2 border-[#63B3ED]/30 rounded-full" />
       </div>

       {loading ? (
         <div className="flex items-center space-x-2">
           <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
           <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading posts...</span>
         </div>
       ) : (
         <div className="space-y-12">
           {posts.map((post) => (
             <article
               key={post.id}
               className="bg-[#131E2B] rounded-xl p-8 border border-[#2C5282]/10 
                       hover:border-[#2C5282]/30 transition-all duration-500 
                       transform hover:-translate-y-2 relative group"
             >
               <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                 <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
                 <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
               </div>

               <div className="text-xl text-[#63B3ED] mb-2 font-['Space_Grotesk']">
                 {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </div>
               <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk']">{post.title}</h2>
               <div className="prose prose-invert max-w-none">
                 {post.content.split('\n').map((paragraph, index) => (
                   paragraph ? (
                     <p key={index} className="text-gray-300 mb-4 font-['Space_Grotesk'] leading-relaxed">
                       {paragraph}
                     </p>
                   ) : null
                 ))}
               </div>
             </article>
           ))}
         </div>
       )}
     </div>
   </div>
 );
};

export default Blog;