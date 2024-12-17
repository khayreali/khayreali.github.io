import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Menu, X, ArrowRight, Terminal, Newspaper } from 'lucide-react';

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
      {['Home', 'Projects', 'Blog', 'About'].map((item) => (
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
              transform relative group p-6 hover:-translate-y-1"
  >
    <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
    </div>

    <h3 className="text-xl font-bold text-white group-hover:text-[#63B3ED] transition-colors font-['Space_Grotesk'] mb-2">
      {project.title}
    </h3>
    
    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 
                 transition-colors font-['Space_Grotesk'] mb-4 line-clamp-2">
      {project.description}
    </p>

    {project.technologies && (
      <div className="flex flex-wrap gap-2">
        {project.technologies.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-[#0F1620] text-[#63B3ED] text-xs rounded-full 
                     border border-[#2C5282]/10 font-['Space_Grotesk']"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </Link>
);

const BlogPreview = ({ post }) => (
  <Link
    to={`/blog/${post.id}`}
    className="block bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
              hover:border-[#2C5282]/30 transition-all duration-500 
              transform relative group p-6 hover:-translate-y-1"
  >
    <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
    </div>

    <div className="text-[#63B3ED] text-sm font-['Space_Grotesk'] mb-2">
      {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>

    <h3 className="text-xl font-bold text-white group-hover:text-[#63B3ED] transition-colors font-['Space_Grotesk'] mb-2">
      {post.title}
    </h3>

    {post.tags && (
      <div className="flex flex-wrap gap-2">
        {post.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-[#0F1620] text-[#63B3ED] text-xs rounded-full 
                     border border-[#2C5282]/10 font-['Space_Grotesk']"
          >
            #{tag.name}{tag.emoji}
          </span>
        ))}
      </div>
    )}
  </Link>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-[#131E2B] rounded-lg border border-[#2C5282]/10">
      <Icon className="text-[#63B3ED]" size={20} />
    </div>
    <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
      {title}
    </h2>
  </div>
);

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(2));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const postsQuery = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(2));
        const postsSnapshot = await getDocs(postsQuery);
        const postsList = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProjects(projectsList);
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
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
            {['Home', 'Projects', 'Blog', 'About'].map((item) => (
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
        <div className="relative mb-16 lg:mb-24">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            Hello
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-2xl font-['Space_Grotesk']">
          Welcome to my page. I showcase different projects I built, and occasionally write out my thoughts.
          </p>
          <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-2 sm:-left-3 lg:-left-4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 border-2 border-[#63B3ED]/20 rounded-full animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#63B3ED]/40 rounded-full animate-[float_6s_ease-in-out_infinite]" />
        </div>

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading content...</span>
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <SectionTitle icon={Terminal} title="Projects" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectPreview key={project.id} project={project} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white transition-all duration-300 group"
                >
                  <span className="font-['Space_Grotesk']">View All Projects</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </div>
            </section>

            <section>
              <SectionTitle icon={Newspaper} title="Blogs" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogPreview key={post.id} post={post} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white transition-all duration-300 group"
                >
                  <span className="font-['Space_Grotesk']">View All Blogs</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;