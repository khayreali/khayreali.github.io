import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import SEO, { createProjectSchema } from '../components/SEO';

const ProjectPost = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // First try to find by slug
        const projectsRef = collection(db, 'projects');
        const slugQuery = query(projectsRef, where('slug', '==', id));
        const slugSnapshot = await getDocs(slugQuery);

        if (!slugSnapshot.empty) {
          const docData = slugSnapshot.docs[0];
          setProject({ id: docData.id, ...docData.data() });
        } else {
          // Fall back to finding by ID
          const docRef = doc(db, 'projects', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProject({ id: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

  if (!project) {
    return (
      <div
        className="min-h-screen pt-16 px-6"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <SEO
          title="Project Not Found"
          description="The project you're looking for doesn't exist."
          url={`/projects/${id}`}
          noIndex={true}
        />
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-xl mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Project not found
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <SEO
        title={project.title}
        description={project.description}
        url={`/projects/${project.slug || project.id}`}
        structuredData={createProjectSchema(project)}
      />

      <div className="max-w-2xl mx-auto pt-16 pb-24 px-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 mb-16 text-sm sans transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <article>
          <h1
            className="text-3xl md:text-4xl mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            {project.title}
          </h1>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="text-sm sans px-3 py-1 rounded"
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

          {project.demoGif && (
            <div
              className="mb-10 rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--border)' }}
            >
              <img
                src={project.demoGif}
                alt={`${project.title} demo`}
                className="w-full"
              />
            </div>
          )}

          <p
            className="text-lg leading-relaxed mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>

          {(project.githubUrl || project.liveUrl) && (
            <div
              className="flex flex-wrap gap-6 pt-8"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sans transition-colors"
                  style={{ color: 'var(--text-muted)' }}
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
                  className="flex items-center gap-2 sans transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ExternalLink size={18} />
                  View live demo
                </a>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ProjectPost;
