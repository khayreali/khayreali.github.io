import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ProjectEditor = () => {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [technologies, setTechnologies] = useState('');
 const [projects, setProjects] = useState([]);
 const [loading, setLoading] = useState(false);

 const fetchProjects = async () => {
   try {
     const querySnapshot = await getDocs(collection(db, 'projects'));
     const projectsList = querySnapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
     setProjects(projectsList);
   } catch (error) {
     console.error('Error fetching projects:', error);
     alert('Failed to fetch projects');
   }
 };

 useEffect(() => {
   fetchProjects();
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     await addDoc(collection(db, 'projects'), {
       title,
       description,
       technologies: technologies.split(',').map(tech => tech.trim()),
       createdAt: new Date().toISOString(),
     });
     setTitle('');
     setDescription('');
     setTechnologies('');
     alert('Project created successfully!');
     fetchProjects();
   } catch (error) {
     console.error('Error adding project:', error);
     alert('Failed to create project');
   } finally {
     setLoading(false);
   }
 };

 const handleDelete = async (projectId) => {
   if (window.confirm('Are you sure you want to delete this project?')) {
     try {
       await deleteDoc(doc(db, 'projects', projectId));
       alert('Project deleted successfully!');
       fetchProjects();
     } catch (error) {
       console.error('Error deleting project:', error);
       alert('Failed to delete project');
     }
   }
 };

 return (
   <div className="max-w-4xl mx-auto p-8">
     <div className="relative mb-12">
       <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
         Create Projects
         <span className="text-[#63B3ED]">.</span>
       </h1>
       <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
       <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
     </div>

     <form onSubmit={handleSubmit} className="space-y-6 mb-12">
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
         <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Description</label>
         <textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                     focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                     text-white font-['Space_Grotesk'] transition-all duration-300 h-32"
           required
           disabled={loading}
         />
       </div>

       <div>
         <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">
           Technologies (comma-separated)
         </label>
         <input
           type="text"
           value={technologies}
           onChange={(e) => setTechnologies(e.target.value)}
           className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                     focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                     text-white font-['Space_Grotesk'] transition-all duration-300"
           placeholder="React, Node.js, Firebase"
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
         <span className="relative z-10">{loading ? 'Creating...' : 'Create Project'}</span>
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
       </button>
     </form>

     <div className="mt-16">
       <div className="relative mb-8">
         <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] relative z-10">
           Existing Projects
           <span className="text-[#63B3ED]">.</span>
         </h2>
       </div>

       <div className="space-y-6">
         {projects.map((project) => (
           <div key={project.id} className="bg-[#131E2B] p-6 rounded-lg border border-[#2C5282]/20 
                                       hover:border-[#2C5282]/30 transition-all duration-300">
             <div className="flex justify-between items-start">
               <div className="flex-1">
                 <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">{project.title}</h3>
                 <p className="text-gray-300 mt-2 font-['Space_Grotesk']">{project.description}</p>
                 <div className="flex flex-wrap gap-2 mt-3">
                   {project.technologies.map((tech, index) => (
                     <span
                       key={index}
                       className="px-3 py-1 bg-[#0F1620] text-[#63B3ED] text-sm rounded-full 
                                border border-[#2C5282]/10 font-['Space_Grotesk']"
                     >
                       {tech}
                     </span>
                   ))}
                 </div>
               </div>
               <button
                 onClick={() => handleDelete(project.id)}
                 className="text-red-400 hover:text-red-300 transition-colors duration-300 font-['Space_Grotesk'] ml-4"
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

export default ProjectEditor;