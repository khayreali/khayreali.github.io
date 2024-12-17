import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

const ProjectPost = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
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
      <div className="min-h-screen bg-[#0F1620] pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0F1620] pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="text-white font-['Space_Grotesk']">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1620]">
      <div className="max-w-4xl mx-auto pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <Link 
          to="/projects"
          className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white 
                   transition-all duration-300 mb-8 hover:translate-x-[-4px]"
        >
          <ArrowLeft size={20} />
          <span className="font-['Space_Grotesk']">Back to Projects</span>
        </Link>

        <article className="bg-gradient-to-b from-[#131E2B] to-[#0F1620] rounded-xl 
                          border border-[#2C5282]/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-[#63B3ED] mr-4"/>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-white to-gray-200 
                           font-['Space_Grotesk']">
                {project.title}
              </h1>
            </div>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#0F1620]/50 text-[#63B3ED] text-sm rounded-full 
                           border border-[#2C5282]/10 font-['Space_Grotesk']
                           shadow-lg shadow-[#63B3ED]/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 text-lg leading-relaxed font-['Space_Grotesk']">
              {project.description}
            </p>
          </div>

          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap gap-6 pt-6 border-t border-[#2C5282]/20">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white 
                           transition-colors font-['Space_Grotesk'] group"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                  View Source Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#63B3ED] hover:text-white 
                           transition-colors font-['Space_Grotesk'] group"
                >
                  <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                  View Live Demo
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