import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-purple-400 hover:text-purple-300">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-purple-400 hover:text-purple-300">About</Link>
          </li>
          <li>
            <Link to="/blog" className="text-purple-400 hover:text-purple-300">Blog</Link>
          </li>
        </ul>
      </nav>
      
      <h1 className="text-4xl font-bold text-purple-400 mb-8">My Projects</h1>
      
      {loading ? (
        <div className="text-purple-400">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-gray-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <h2 className="text-xl font-bold text-purple-400 mb-2">{project.title}</h2>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;