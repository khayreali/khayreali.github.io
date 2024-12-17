import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Menu, X, ArrowRight } from 'lucide-react';

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

const ProjectPreview = ({ project }) => (
  <Link
    to={`/projects/${project.id}`}
    className="block bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
              hover:border-[#2C5282]/30 transition-all duration-500 
              transform relative group p-6 sm:p-8 hover:-translate-y-1"
  >
    <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
    </div>

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-0.5 h-4 sm:h-6 bg-[#63B3ED] mr-2 sm:mr-3 group-hover:h-8 transition-all"/>
        <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#63B3ED] transition-colors font-['Space_Grotesk']">
          {project.title}
        </h2>
      </div>
      <ArrowRight 
        className="text-[#63B3ED] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" 
        size={20} 
      />
    </div>
    
    <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 
                 transition-colors font-['Space_Grotesk'] mb-4 line-clamp-2">
      {project.description}
    </p>

    {project.technologies && project.technologies.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 sm:px-3 py-1 bg-[#0F1620] text-[#63B3ED] text-xs sm:text-sm rounded-full 
                     border border-[#2C5282]/10 font-['Space_Grotesk'] transition-all duration-300
                     group-hover:border-[#2C5282]/30"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </Link>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
          <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-2 sm:-left-3 lg:-left-4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 border-2 border-[#63B3ED]/20 rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#63B3ED]/40 rounded-full pointer-events-none" />
          <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 right-1/4 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#63B3ED]/30 rounded-full pointer-events-none" />
        </div>

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {projects.map((project) => (
              <ProjectPreview key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;