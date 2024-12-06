import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';

const ProjectCard = ({ project, isExpanded, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={`group bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
                hover:border-[#2C5282]/30 transition-all duration-500 relative
                cursor-pointer transform hover:-translate-y-2 hover:shadow-lg 
                hover:shadow-[#63B3ED]/5 ${isExpanded ? 'p-8' : 'p-6'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#63B3ED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"/>
      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
      </div>

      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center">
          <div className="w-0.5 h-6 bg-[#63B3ED] mr-3 group-hover:h-8 transition-all"/>
          <h2 className="text-2xl font-bold text-white group-hover:text-[#63B3ED] transition-colors font-['Space_Grotesk']">
            {project.title}
          </h2>
        </div>
        <ChevronDown 
          className={`text-[#63B3ED] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-4 py-1.5 bg-[#0F1620] text-[#63B3ED] text-sm rounded-full 
                     border border-[#2C5282]/10 hover:border-[#2C5282]/30 
                     transition-all duration-300 hover:bg-[#63B3ED]/5 font-['Space_Grotesk']"
            onClick={(e) => e.stopPropagation()}
          >
            {tech}
          </span>
        ))}
      </div>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out
                  ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="border-t border-[#2C5282]/10 pt-4 mt-2">
          <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors font-['Space_Grotesk']">
            {project.description}
          </p>

          {/* Project Links - Only shown when expanded */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex gap-4 mt-6">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors font-['Space_Grotesk']"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={18} />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors font-['Space_Grotesk']"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

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

  const toggleProject = (projectId) => {
    setExpandedProjectId(current => current === projectId ? null : projectId);
  };

  return (
    <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
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
        <div className="relative mb-24">
          <h1 className="text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            Projects
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-8 -left-4 w-24 h-24 border-2 border-[#63B3ED]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#63B3ED]/40 rounded-full" />
          <div className="absolute -bottom-4 right-1/4 w-12 h-12 border-2 border-[#63B3ED]/30 rounded-full" />
        </div>

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProjectId === project.id}
                onToggle={() => toggleProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;