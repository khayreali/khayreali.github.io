import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronDown, ExternalLink, Github, Menu, X } from 'lucide-react';

const MobileNav = ({ isOpen, onClose }) => (
  <div className={`fixed inset-0 bg-[#0F1620]/95 backdrop-blur-sm z-50 lg:hidden transition-all duration-300 ${
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}>
    <div className="flex justify-end p-6">
      <button onClick={onClose} className="text-[#63B3ED] hover:text-white transition-all duration-300">
        <X size={24} />
      </button>
    </div>
    <nav className="flex flex-col items-center space-y-8 pt-12">
      {['Home', 'About', 'Blog'].map((item) => (
        <Link
          key={item}
          to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
          onClick={onClose}
          className="text-2xl text-[#63B3ED] hover:text-white transition-all duration-300 font-['Space_Grotesk']"
        >
          {item}
        </Link>
      ))}
    </nav>
  </div>
);

const ProjectCard = ({ project, isExpanded, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={`group bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
                hover:border-[#2C5282]/30 transition-all duration-500 relative
                cursor-pointer transform hover:-translate-y-2 hover:shadow-lg 
                hover:shadow-[#63B3ED]/5 ${isExpanded ? 'p-6 sm:p-8' : 'p-4 sm:p-6'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#63B3ED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"/>
      <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
      </div>

      <div className="flex items-center justify-between mb-4 sm:mb-6 relative">
        <div className="flex items-center">
          <div className="w-0.5 h-4 sm:h-6 bg-[#63B3ED] mr-2 sm:mr-3 group-hover:h-8 transition-all"/>
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#63B3ED] transition-colors font-['Space_Grotesk']">
            {project.title}
          </h2>
        </div>
        <ChevronDown 
          className={`text-[#63B3ED] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 sm:px-4 py-1 sm:py-1.5 bg-[#0F1620] text-[#63B3ED] text-xs sm:text-sm rounded-full 
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
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors font-['Space_Grotesk']">
            {project.description}
          </p>

          {/* Project Links - Only shown when expanded */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap gap-4 mt-4 sm:mt-6">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors font-['Space_Grotesk'] text-sm sm:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors font-['Space_Grotesk'] text-sm sm:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F1620]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center lg:hidden">
            <Link to="/" className="text-[#63B3ED] font-['Space_Grotesk'] text-xl">
              Portfolio
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#63B3ED] hover:text-white transition-all duration-300"
            >
              <Menu size={24} />
            </button>
          </div>
          <ul className="hidden lg:flex space-x-12">
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

      <div className="max-w-7xl mx-auto pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 sm:mb-16 lg:mb-24">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            Projects
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-2 sm:-left-3 lg:-left-4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 border-2 border-[#63B3ED]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#63B3ED]/40 rounded-full" />
          <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 right-1/4 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#63B3ED]/30 rounded-full" />
        </div>

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 relative">
            {projects.map((project) => (
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