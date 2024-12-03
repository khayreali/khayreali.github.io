import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const generateStars = () => {
  return [...Array(100)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 4 + 1}px`,
    animation: `twinkle ${Math.random() * 3 + 2}s infinite`
  }));
};

const stars = generateStars();

const About = () => {
  const [aboutData, setAboutData] = useState({
    name: '',
    role: '',
    introduction: '',
    experience: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-50">
        {stars.map((style, i) => (
          <div
            key={i}
            className="absolute bg-[#63B3ED] rounded-full"
            style={style}
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
            About
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-8 -left-4 w-24 h-24 border-2 border-[#63B3ED]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#63B3ED]/40 rounded-full" />
          <div className="absolute -bottom-4 right-1/4 w-12 h-12 border-2 border-[#63B3ED]/30 rounded-full" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-[#63B3ED] font-['Space_Grotesk']">Loading...</div>
        ) : (
          <div className="relative z-10">
            <div className="bg-[#131E2B] rounded-xl p-8 border border-[#2C5282]/10
                          hover:border-[#2C5282]/30 transition-all duration-500 transform hover:-translate-y-2">
              <div className="max-w-3xl">
                <p className="text-gray-300 text-lg leading-relaxed mb-6 font-['Space_Grotesk']">
                  Hi, I'm {aboutData.name}. I'm a {aboutData.role} {aboutData.introduction}
                </p>

                <h2 className="text-2xl font-bold text-[#63B3ED] mb-4 font-['Space_Grotesk']">
                  Experience
                </h2>
                <p className="text-gray-300 mb-6 font-['Space_Grotesk'] whitespace-pre-line">
                  {aboutData.experience}
                </p>

                <h2 className="text-2xl font-bold text-[#63B3ED] mb-4 font-['Space_Grotesk']">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {aboutData.skills.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-1.5 bg-[#0F1620] text-[#63B3ED]
                               rounded-full border border-[#2C5282]/10
                               hover:border-[#2C5282]/30 transition-all duration-300
                               font-['Space_Grotesk']"
                    >
                      {skill.trim()}
                    </span>
                  ))}
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