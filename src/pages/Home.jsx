import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ExternalLink, Github, Linkedin, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import SEO, { createWebsiteSchema, createPersonSchema } from '../components/SEO';

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

// Project card with expandable details
const ProjectCard = ({ project, isExpanded, onToggle }) => (
  <div
    className="rounded-lg overflow-hidden"
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)'
    }}
  >
    <button
      onClick={onToggle}
      className="w-full p-6 text-left transition-colors hover:opacity-90"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className="text-xl mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {project.title}
          </h3>
          <p
            className={`text-base leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>
        </div>
        <div
          className="flex-shrink-0 mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="text-sm sans px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-muted)'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </button>

    {isExpanded && (
      <div
        className="px-6 pb-6 pt-2"
        style={{ borderTop: '1px solid var(--border-light)' }}
      >
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sans transition-colors hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                <Github size={18} />
                View source code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sans transition-colors hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                <ExternalLink size={18} />
                View live demo
              </a>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by order field, then by createdAt as fallback
        projectsList.sort((a, b) => {
          const orderA = a.order ?? 999;
          const orderB = b.order ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const aboutRef = doc(db, 'content', 'about');
        const aboutSnap = await getDoc(aboutRef);

        setProjects(projectsList);
        if (aboutSnap.exists()) {
          setAboutData(aboutSnap.data());
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // Create combined structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      createWebsiteSchema(),
      createPersonSchema(aboutData)
    ]
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <p style={{ color: 'var(--text-muted)' }} className="italic">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <SEO
        title={null}
        description={aboutData?.introduction || "Software engineer and builder. Exploring quantitative trading, machine learning, and building useful things."}
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
        <section id="about" className="mb-16">
          {aboutData?.imageUrl && (
            <div className="mb-6">
              <img
                src={aboutData.imageUrl}
                alt={aboutData.name || 'Profile'}
                className="w-28 h-28 rounded-full object-cover"
                style={{ border: '2px solid var(--border)' }}
              />
            </div>
          )}

          <p
            className="text-lg leading-relaxed mb-6 whitespace-pre-line"
            style={{ color: 'var(--text-secondary)' }}
          >
            {aboutData?.introduction || 'Welcome to my portfolio.'}
          </p>

          {/* Experience */}
          <div className="mb-6">
            <h2
              className="text-lg mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Experience
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-secondary)' }}>WPP</span>
                <span className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                  Current
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
          <div className="mb-6">
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

        {/* Projects Section */}
        <section id="projects" className="mb-16">
          <h2
            className="text-2xl mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Projects
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProject === project.id}
                onToggle={() => toggleProject(project.id)}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <p className="italic" style={{ color: 'var(--text-muted)' }}>
              No projects yet.
            </p>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <p
            className="text-sm sans"
            style={{ color: 'var(--text-muted)' }}
          >
            &copy; {new Date().getFullYear()} {aboutData?.name}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
