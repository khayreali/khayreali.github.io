import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Terminal, Briefcase, Code, Menu, X } from 'lucide-react';

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

const AboutSection = ({ icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative p-3 sm:p-4 rounded-full border-2 transition-all duration-300
              ${isActive 
                ? 'border-[#63B3ED] bg-[#63B3ED]/10' 
                : 'border-[#2C5282]/20 hover:border-[#63B3ED]/50'}`}
  >
    <div className={`transition-colors duration-300
                   ${isActive ? 'text-[#63B3ED]' : 'text-gray-400 group-hover:text-[#63B3ED]'}`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-sm text-[#63B3ED] whitespace-nowrap font-['Space_Grotesk']">
        {title}
      </span>
    </div>
  </button>
);

const About = () => {
  const [aboutData, setAboutData] = useState({
    name: '',
    introduction: '',
    experience: '',
    skills: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const sections = {
    intro: {
      icon: <Terminal />,
      title: "Introduction",
      content: aboutData.introduction
    },
    experience: {
      icon: <Briefcase />,
      title: "Experience",
      content: aboutData.experience
    },
    skills: {
      icon: <Code />,
      title: "Skills",
      content: aboutData.skills
    }
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
              About
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
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading...</span>
          </div>
        ) : (
          <div className="relative">
            <div className="relative mb-12 sm:mb-16 lg:mb-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-2 sm:-left-3 lg:-left-4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 border-2 border-[#63B3ED]/20 rounded-full animate-[float_4s_ease-in-out_infinite]" />
                  <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#63B3ED]/40 rounded-full animate-[float_6s_ease-in-out_infinite]" />
                  <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 right-1/4 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#63B3ED]/30 rounded-full animate-[float_5s_ease-in-out_infinite]" />
                  <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
                    {aboutData.name}
                    <span className="text-[#63B3ED]">.</span>
                  </h1>
                </div>
              </div>
              
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 animate-[float-slow_6s_ease-in-out_infinite] shrink-0">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#63B3ED]/10 via-[#63B3ED]/20 to-[#63B3ED]/10 
                              animate-[holographic_3s_linear_infinite] blur-sm" />
                
                <div className="absolute inset-0 rounded-full overflow-hidden bg-[#131E2B] group">
                  {aboutData.imageUrl ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#63B3ED]/10 via-transparent to-[#63B3ED]/10 
                                    animate-[pulse_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-70 transition-all duration-500" />
                      
                      <div className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-[#63B3ED]/50 to-transparent 
                                    blur-sm animate-[scan_2s_linear_infinite] group-hover:via-[#63B3ED]" />
                      
                      <div className="absolute inset-0 group-hover:animate-[glitch_5s_ease-in-out_infinite]">
                        <img
                          src={aboutData.imageUrl}
                          alt={aboutData.name || 'Profile'}
                          className="w-full h-full object-cover scale-105"
                        />
                      </div>
                      
                      <img
                        src={aboutData.imageUrl}
                        alt={aboutData.name || 'Profile'}
                        className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#63B3ED]/0 via-[#63B3ED]/10 to-[#63B3ED]/0 
                                    opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-[#63B3ED]/20 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-center sm:justify-start gap-4 mb-6 sm:mb-8">
                {Object.entries(sections).map(([key, section]) => (
                  <AboutSection
                    key={key}
                    icon={section.icon}
                    title={section.title}
                    isActive={activeSection === key}
                    onClick={() => setActiveSection(key)}
                  />
                ))}
              </div>

              <div className="block sm:hidden text-center mb-4">
                <span className="text-[#63B3ED] font-['Space_Grotesk']">
                  {sections[activeSection].title}
                </span>
              </div>

              <div className="bg-[#131E2B] rounded-xl p-6 sm:p-8 border border-[#2C5282]/10 
                            hover:border-[#2C5282]/30 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden">
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
                  <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
                </div>

                <div className="max-w-3xl mx-auto">
                  {activeSection === 'skills' ? (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {aboutData.skills.split(',').map((skill, index) => (
                        <div
                          key={index}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0F1620] text-[#63B3ED] rounded-full
                                   border border-[#2C5282]/10 hover:border-[#2C5282]/30 
                                   transition-all duration-300 hover:transform hover:-translate-y-1
                                   text-sm sm:text-base font-['Space_Grotesk']"
                        >
                          {skill.trim()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-['Space_Grotesk'] whitespace-pre-line">
                      {sections[activeSection].content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;