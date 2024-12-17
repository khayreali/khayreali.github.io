import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Menu, X, Globe, Github, Trash2, Pencil, ArrowLeft, Loader2 } from 'lucide-react';

const ProjectEditor = () => {
  const { id } = useParams(); // Get project ID if in edit mode
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Fetch single project if in edit mode
  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        setInitialLoading(true);
        setEditMode(true);
        try {
          const docRef = doc(db, 'projects', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setDescription(data.description || '');
            setTechnologies(data.technologies.join(', ') || '');
            setGithubUrl(data.githubUrl || '');
            setLiveUrl(data.liveUrl || '');
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          alert('Failed to fetch project');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchProject();
  }, [id]);

  // Fetch all projects for the list
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      projectsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects');
    }
  };

  useEffect(() => {
    if (!id) { // Only fetch all projects when not in edit mode
      fetchProjects();
    }
  }, [id]);

  // Handle form submission for both create and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const projectData = {
      title,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editMode) {
        // Update existing project
        await updateDoc(doc(db, 'projects', id), projectData);
        alert('Project updated successfully!');
        navigate('/admin/projects'); // Return to projects list
      } else {
        // Create new project
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'projects'), projectData);
        setTitle('');
        setDescription('');
        setTechnologies('');
        setGithubUrl('');
        setLiveUrl('');
        alert('Project created successfully!');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} project`);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        alert('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0F1620] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1620]">
      <div className="max-w-4xl mx-auto p-8">
      {editMode ? (
  <button
    onClick={() => {
      navigate('/admin/projects');
      window.location.reload();
    }}
    type="button"
    className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white 
             transition-all duration-300 mb-8 hover:translate-x-[-4px]"
  >
    <ArrowLeft size={20} />
    <span className="font-['Space_Grotesk']">Back to Projects</span>
  </button>
) : null}
        <div className="relative mb-12">
          <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            {editMode ? 'Edit Project' : 'Create Project'}
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="bg-[#131E2B] rounded-xl border border-[#2C5282]/10 p-6 sm:p-8 space-y-6 mb-12">
          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              required
              disabled={loading}
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300 h-32"
              required
              disabled={loading}
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">
              Technologies <span className="text-sm text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              placeholder="React, Node.js, Firebase"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              placeholder="https://github.com/username/project"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Live Demo URL</label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              placeholder="https://your-project.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white rounded-lg 
                    transition-all duration-300 font-['Space_Grotesk'] relative overflow-hidden group
                    disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Project' : 'Create Project')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </form>
        {!editMode && (
          <div className="mt-16">
            <div className="relative mb-8">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] relative z-10">
                Manage Projects
                <span className="text-[#63B3ED]">.</span>
              </h2>
            </div>

            <div className="space-y-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
                           hover:border-[#2C5282]/30 transition-all duration-300 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4 font-['Space_Grotesk']">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#0F1620] text-[#63B3ED] text-sm rounded-full 
                                     border border-[#2C5282]/10 font-['Space_Grotesk']"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#63B3ED] hover:text-white 
                                     transition-colors text-sm font-['Space_Grotesk']"
                          >
                            <Github size={16} />
                            Source Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#63B3ED] hover:text-white 
                                     transition-colors text-sm font-['Space_Grotesk']"
                          >
                            <Globe size={16} />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/projects/edit/${project.id}`}
                        className="text-[#63B3ED] hover:text-white p-2 rounded-lg
                                 transition-colors duration-300 hover:bg-[#63B3ED]/10"
                      >
                        <Pencil size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg
                                 transition-colors duration-300 hover:bg-red-400/10"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;