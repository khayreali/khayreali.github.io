import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ArrowLeft, Github, ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project.slug || project.id}`}
    className="block rounded-lg card-hover overflow-hidden"
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)'
    }}
  >
    {project.demoGif && (
      <div className="w-full aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <img
          src={project.demoGif}
          alt={`${project.title} demo`}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-6">
    <h3
      className="text-xl mb-3"
      style={{ color: 'var(--text-primary)' }}
    >
      {project.title}
    </h3>
    <p
      className="text-base leading-relaxed mb-4 line-clamp-3"
      style={{ color: 'var(--text-secondary)' }}
    >
      {project.description}
    </p>

    {project.technologies && project.technologies.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
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

    <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
      {project.githubUrl && (
        <span
          className="flex items-center gap-1.5 text-sm sans"
          style={{ color: 'var(--text-muted)' }}
        >
          <Github size={14} />
          Code
        </span>
      )}
      {project.liveUrl && (
        <span
          className="flex items-center gap-1.5 text-sm sans"
          style={{ color: 'var(--text-muted)' }}
        >
          <ExternalLink size={14} />
          Demo
        </span>
      )}
      <span
        className="flex items-center gap-1 text-sm sans ml-auto"
        style={{ color: 'var(--accent)' }}
      >
        Read more
        <ArrowRight size={14} />
      </span>
    </div>
    </div>
  </Link>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(projectsQuery);
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

  // Create ItemList structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Khayre Ali - Projects',
    description: 'A collection of work and experiments.',
    url: 'https://khayreali.com/#/projects',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: `https://khayreali.com/#/projects/${project.slug || project.id}`
      }
    }))
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <p className="italic" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <SEO
        title="Projects"
        description="A collection of software projects, experiments, and open source work by Khayre Ali."
        url="/projects"
        structuredData={structuredData}
      />

      <div className="max-w-3xl mx-auto pt-16 pb-24 px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-16 text-sm sans transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <h1
          className="text-3xl mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Projects
        </h1>
        <p
          className="text-lg mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          A collection of work and experiments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="italic" style={{ color: 'var(--text-muted)' }}>
            No projects yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Projects;
