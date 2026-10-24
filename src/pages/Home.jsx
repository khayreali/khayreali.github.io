import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Github, Linkedin, Sun, Moon } from 'lucide-react';
import SEO, { createWebsiteSchema, createPersonSchema } from '../components/SEO';
import profile from '../data/profile.json';

// Theme toggle hook
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return { theme, toggleTheme, isDark };
};

const Home = () => {
  const [aboutData, setAboutData] = useState(profile);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const aboutRef = doc(db, 'content', 'about');
        const aboutSnap = await getDoc(aboutRef);

        if (aboutSnap.exists()) {
          const content = aboutSnap.data();
          setAboutData({
            ...profile,
            ...content,
            introduction: content.introduction || profile.introduction,
            imageUrl: content.imageUrl || profile.imageUrl
          });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  // Create combined structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      createWebsiteSchema(),
      createPersonSchema()
    ]
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <SEO
        title={null}
        description={profile.description}
        type="profile"
        url="/"
        structuredData={structuredData}
      />

      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={toggleTheme}
          className="p-2 rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">

        {/* About Section */}
        <section id="about" className="mb-16" itemScope itemType="https://schema.org/Person">
          {aboutData?.imageUrl && (
            <div className="mb-6">
              <img
                src={aboutData.imageUrl}
                alt="Khayre Ali"
                width="112"
                height="112"
                className="w-28 h-28 rounded-full object-cover"
                style={{ border: '2px solid var(--border)' }}
                itemProp="image"
              />
            </div>
          )}

          <h1
            className="text-3xl mb-4"
            style={{ color: 'var(--text-primary)' }}
            itemProp="name"
          >
            Khayre Ali
          </h1>

          <p
            className="text-lg leading-relaxed mb-6 whitespace-pre-line"
            style={{ color: 'var(--text-secondary)' }}
            itemProp="description"
          >
            {aboutData.introduction}
          </p>

          {/* Experience */}
          <div className="mb-6" data-nosnippet="">
            <h2
              className="text-lg mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Experience
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>General Intuition</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  Current
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>MSCI Inc.</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2026
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>WPP</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2026
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>Plain Sight Capital</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2023
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>PwC</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2020
                </span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-6" data-nosnippet="">
            <h2
              className="text-lg mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Education
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Northeastern University, MS Computer Science
                </span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2027
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>
                  NYU Stern School of Business, BS Business
                </span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  2020
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/khayreali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base sans transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/khayreali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base sans transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <p
            className="text-sm sans"
            style={{ color: 'var(--text-muted)' }}
          >
            <span data-nosnippet="">&copy; {new Date().getFullYear()} {aboutData?.name}</span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
