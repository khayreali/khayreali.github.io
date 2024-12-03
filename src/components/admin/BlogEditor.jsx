import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const BlogEditor = () => {
 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [date, setDate] = useState('');
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(false);

 const fetchBlogs = async () => {
   try {
     const querySnapshot = await getDocs(collection(db, 'blogs'));
     const blogsList = querySnapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
     blogsList.sort((a, b) => new Date(b.date) - new Date(a.date));
     setBlogs(blogsList);
   } catch (error) {
     console.error('Error fetching blogs:', error);
     alert('Failed to fetch blogs');
   }
 };

 useEffect(() => {
   fetchBlogs();
   const today = new Date();
   const localDate = today.getFullYear() + '-' + 
     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
     String(today.getDate()).padStart(2, '0');
   setDate(localDate);
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     await addDoc(collection(db, 'blogs'), {
       title,
       content,
       date,
       createdAt: new Date().toISOString(),
     });
     setTitle('');
     setContent('');
     setDate(new Date().toISOString().split('T')[0]);
     alert('Blog post created successfully!');
     fetchBlogs();
   } catch (error) {
     console.error('Error adding blog post:', error);
     alert('Failed to create blog post');
   } finally {
     setLoading(false);
   }
 };

 const handleDelete = async (blogId) => {
   if (window.confirm('Are you sure you want to delete this blog post?')) {
     try {
       await deleteDoc(doc(db, 'blogs', blogId));
       alert('Blog post deleted successfully!');
       fetchBlogs();
     } catch (error) {
       console.error('Error deleting blog post:', error);
       alert('Failed to delete blog post');
     }
   }
 };

 return (
   <div className="max-w-4xl mx-auto p-8">
     <div className="relative mb-12">
       <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
         Create Blog Posts
         <span className="text-[#63B3ED]">.</span>
       </h1>
       <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
       <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
     </div>

     <form onSubmit={handleSubmit} className="space-y-6 mb-12">
       <div>
         <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Date</label>
         <input
           type="date"
           value={date}
           onChange={(e) => setDate(e.target.value)}
           className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                     focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                     text-white font-['Space_Grotesk'] transition-all duration-300"
           required
           disabled={loading}
         />
       </div>

       <div>
         <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Title</label>
         <input
           type="text"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                     focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                     text-white font-['Space_Grotesk'] transition-all duration-300"
           required
           disabled={loading}
         />
       </div>

       <div>
         <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Content</label>
         <textarea
           value={content}
           onChange={(e) => setContent(e.target.value)}
           className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                     focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                     text-white font-['Space_Grotesk'] transition-all duration-300 h-64"
           required
           disabled={loading}
         />
       </div>

       <button
         type="submit"
         disabled={loading}
         className="px-6 py-3 bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white rounded-lg 
                   transition-all duration-300 font-['Space_Grotesk'] relative overflow-hidden group"
       >
         <span className="relative z-10">{loading ? 'Creating...' : 'Create Blog Post'}</span>
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
       </button>
     </form>

     <div className="mt-16">
       <div className="relative mb-8">
         <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] relative z-10">
           Existing Blog Posts
           <span className="text-[#63B3ED]">.</span>
         </h2>
       </div>

       <div className="space-y-6">
         {blogs.map((blog) => (
           <div key={blog.id} className="bg-[#131E2B] p-6 rounded-lg border border-[#2C5282]/20 
                                     hover:border-[#2C5282]/30 transition-all duration-300">
             <div className="flex justify-between items-start">
               <div>
                 <div className="text-[#63B3ED] text-sm font-['Space_Grotesk']">
                   {new Date(blog.date + 'T00:00:00').toLocaleDateString()}
                 </div>
                 <h3 className="text-xl font-semibold text-white font-['Space_Grotesk'] mt-1">{blog.title}</h3>
                 <p className="text-gray-300 mt-2 line-clamp-3 font-['Space_Grotesk']">{blog.content}</p>
               </div>
               <button
                 onClick={() => handleDelete(blog.id)}
                 className="text-red-400 hover:text-red-300 transition-colors duration-300 font-['Space_Grotesk']"
               >
                 Delete
               </button>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );
};

export default BlogEditor;