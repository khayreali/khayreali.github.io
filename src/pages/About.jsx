import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Terminal, Briefcase, Code } from 'lucide-react';

const CosmicAbout = () => {
  const [aboutData, setAboutData] = useState({
    name: '',
    introduction: '',
    experience: '',
    skills: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('intro');

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
      icon: <Terminal size={24} />,
      title: "Introduction",
      content: aboutData.introduction
    },
    experience: {
      icon: <Briefcase size={24} />,
      title: "Experience",
      content: aboutData.experience
    },
    skills: {
      icon: <Code size={24} />,
      title: "Skills",
      content: aboutData.skills
    }
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
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading...</span>
          </div>
        ) : (
          <div className="relative">
            {/* Hero Section with Image */}
            <div className="relative mb-24 flex items-center gap-12">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -top-8 -left-4 w-24 h-24 border-2 border-[#63B3ED]/20 rounded-full animate-[float_4s_ease-in-out_infinite]" />
                  <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#63B3ED]/40 rounded-full animate-[float_6s_ease-in-out_infinite]" />
                  <div className="absolute -bottom-4 right-1/4 w-12 h-12 border-2 border-[#63B3ED]/30 rounded-full animate-[float_5s_ease-in-out_infinite]" />
                  <h1 className="text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
                    {aboutData.name}
                    <span className="text-[#63B3ED]">.</span>
                  </h1>
                </div>
              </div>
              
              {/* Holographic Profile Image */}
              <div className="relative w-64 h-64 animate-[float-slow_6s_ease-in-out_infinite]">
                {/* Outer ring with rotating gradient */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#63B3ED]/10 via-[#63B3ED]/20 to-[#63B3ED]/10 
                              animate-[holographic_3s_linear_infinite] blur-sm" />
                
                {/* Main image container */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-[#131E2B] group">
                  {aboutData.imageUrl ? (
                    <>
                      {/* Holographic effects layer */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#63B3ED]/10 via-transparent to-[#63B3ED]/10 
                                    animate-[pulse_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-70 transition-all duration-500" />
                      
                      {/* Scanning line */}
                      <div className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-[#63B3ED]/50 to-transparent 
                                    blur-sm animate-[scan_2s_linear_infinite] group-hover:via-[#63B3ED]" />
                      
                      {/* Glitch effect container */}
                      <div className="absolute inset-0 group-hover:animate-[glitch_5s_ease-in-out_infinite]">
                        <img
                          src={aboutData.imageUrl}
                          alt={aboutData.name || 'Profile'}
                          className="w-full h-full object-cover scale-105"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/256/256';
                            console.error('Error loading profile image');
                          }}
                        />
                      </div>
                      
                      {/* Main image */}
                      <img
                        src={aboutData.imageUrl}
                        alt={aboutData.name || 'Profile'}
                        className="w-full h-full object-cover relative z-10 group-hover:scale-105 
                                 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/256/256';
                          console.error('Error loading profile image');
                        }}
                      />
                      
                      {/* Holographic overlay */}
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

            {/* Interactive Content Panel */}
            <div className="relative">
              {/* Navigation Circles */}
              <div className="flex gap-4 mb-8">
                {Object.entries(sections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`group relative p-4 rounded-full border-2 transition-all duration-300
                              ${activeSection === key 
                                ? 'border-[#63B3ED] bg-[#63B3ED]/10' 
                                : 'border-[#2C5282]/20 hover:border-[#63B3ED]/50'}`}
                  >
                    <div className={`transition-colors duration-300
                                 ${activeSection === key ? 'text-[#63B3ED]' : 'text-gray-400 group-hover:text-[#63B3ED]'}`}>
                      {section.icon}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm text-[#63B3ED] whitespace-nowrap font-['Space_Grotesk']">
                        {section.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Content Display */}
              <div className="bg-[#131E2B] rounded-xl p-8 border border-[#2C5282]/10 
                            hover:border-[#2C5282]/30 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
                  <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
                </div>

                <div className="max-w-3xl">
                  {activeSection === 'skills' ? (
                    <div className="flex flex-wrap gap-3">
                      {aboutData.skills.split(',').map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-[#0F1620] text-[#63B3ED] rounded-full
                                   border border-[#2C5282]/10 hover:border-[#2C5282]/30 
                                   transition-all duration-300 hover:transform hover:-translate-y-1
                                   font-['Space_Grotesk']"
                        >
                          {skill.trim()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300 leading-relaxed font-['Space_Grotesk'] whitespace-pre-line">
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

export default CosmicAbout;