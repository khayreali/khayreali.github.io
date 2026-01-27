import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { Globe, Github, Trash2, Pencil, ArrowLeft, Loader2, Link as LinkIcon, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

const ProjectEditor = () => {
  const { id } = useParams();
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
  const [fetchingRepo, setFetchingRepo] = useState(false);
  const [repoInput, setRepoInput] = useState('');
  const [reordering, setReordering] = useState(false);

  // Parse GitHub URL to extract owner and repo
  const parseGithubUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    const match = trimmed.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
    return null;
  };

  // Fetch repo data from GitHub API
  const fetchGithubRepo = async (urlToFetch) => {
    const url = urlToFetch || repoInput;
    const parsed = parseGithubUrl(url);
    if (!parsed) {
      alert('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
      return;
    }

    setFetchingRepo(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      if (!response.ok) {
        throw new Error('Repository not found');
      }
      const data = await response.json();

      // Auto-fill the form
      setTitle(data.name);
      setDescription(data.description || '');
      setGithubUrl(data.html_url);
      if (data.homepage) {
        setLiveUrl(data.homepage);
      }
      // Use topics as technologies, or language if no topics
      if (data.topics && data.topics.length > 0) {
        setTechnologies(data.topics.join(', '));
      } else if (data.language) {
        setTechnologies(data.language);
      }

      setRepoInput('');
    } catch (error) {
      console.error('Error fetching GitHub repo:', error);
      alert('Failed to fetch repository. Make sure the URL is correct and the repo is public.');
    } finally {
      setFetchingRepo(false);
    }
  };

  // Handle paste in repo input
  const handleRepoInputChange = (e) => {
    const value = e.target.value;
    setRepoInput(value);

    // Auto-fetch if a valid GitHub URL is pasted
    if (value.includes('github.com/') && parseGithubUrl(value)) {
      setTimeout(() => {
        fetchGithubRepo(value);
      }, 500);
    }
  };

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

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({
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
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects');
    }
  };

  useEffect(() => {
    if (!id) {
      fetchProjects();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      title,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()).filter(t => t),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editMode) {
        await updateDoc(doc(db, 'projects', id), projectData);
        alert('Project updated successfully!');
        navigate('/admin/projects');
      } else {
        projectData.createdAt = new Date().toISOString();
        // Set order to be at the end
        projectData.order = projects.length;
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

  const moveProject = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;

    setReordering(true);

    // Create new array with swapped positions
    const newProjects = [...projects];
    [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];

    // Update state immediately for responsive UI
    setProjects(newProjects);

    // Update order in Firebase
    try {
      const batch = writeBatch(db);
      newProjects.forEach((project, idx) => {
        const projectRef = doc(db, 'projects', project.id);
        batch.update(projectRef, { order: idx });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error reordering projects:', error);
      alert('Failed to save new order');
      // Revert on error
      fetchProjects();
    } finally {
      setReordering(false);
    }
  };

  if (initialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} />
          <span className="sans" style={{ color: 'var(--text-muted)' }}>Loading project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto p-8">
        {editMode && (
          <button
            onClick={() => {
              navigate('/admin/projects');
              window.location.reload();
            }}
            type="button"
            className="inline-flex items-center gap-2 mb-8 transition-colors hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft size={20} />
            <span className="sans">Back to Projects</span>
          </button>
        )}

        <h1
          className="text-3xl mb-10"
          style={{ color: 'var(--text-primary)' }}
        >
          {editMode ? 'Edit Project' : 'Create Project'}
        </h1>

        {/* GitHub Import Section */}
        {!editMode && (
          <div
            className="rounded-lg p-6 mb-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              <LinkIcon size={16} className="inline mr-2" />
              Import from GitHub
            </label>
            <p className="text-sm mb-3 sans" style={{ color: 'var(--text-muted)' }}>
              Paste a GitHub repo URL to auto-fill project details
            </p>
            <div className="flex gap-3">
              <input
                type="url"
                value={repoInput}
                onChange={handleRepoInputChange}
                className="flex-1 p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
                placeholder="https://github.com/username/repo"
                disabled={fetchingRepo}
              />
              <button
                type="button"
                onClick={fetchGithubRepo}
                disabled={fetchingRepo || !repoInput}
                className="px-6 py-3 rounded-md sans transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                {fetchingRepo ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Import'
                )}
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-6 sm:p-8 space-y-6 mb-12"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)'
          }}
        >
          <div>
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              required
              disabled={loading}
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2 h-32"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              required
              disabled={loading}
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              Technologies <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(comma-separated)</span>
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="React, Node.js, Firebase"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="https://github.com/username/project"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
              Live Demo URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="https://your-project.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-md sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Project' : 'Create Project')}
            </span>
          </button>
        </form>

        {!editMode && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-2xl"
                style={{ color: 'var(--text-primary)' }}
              >
                Manage Projects
              </h2>
              <p className="text-sm sans" style={{ color: 'var(--text-muted)' }}>
                <GripVertical size={14} className="inline mr-1" />
                Use arrows to reorder
              </p>
            </div>

            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="rounded-lg p-4 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    opacity: reordering ? 0.7 : 1
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveProject(index, -1)}
                        disabled={index === 0 || reordering}
                        className="p-1 rounded transition-colors disabled:opacity-30"
                        style={{ color: 'var(--text-muted)' }}
                        title="Move up"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        onClick={() => moveProject(index, 1)}
                        disabled={index === projects.length - 1 || reordering}
                        className="p-1 rounded transition-colors disabled:opacity-30"
                        style={{ color: 'var(--text-muted)' }}
                        title="Move down"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {/* Project info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg mb-1 truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {project.title}
                      </h3>
                      <p
                        className="text-sm sans truncate"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies?.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs rounded-full sans"
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span
                            className="text-xs sans"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md transition-colors hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                          title="View on GitHub"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md transition-colors hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                          title="View live demo"
                        >
                          <Globe size={18} />
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/projects/edit/${project.id}`}
                        className="p-2 rounded-md transition-colors hover:opacity-70"
                        style={{ color: 'var(--accent)' }}
                        title="Edit project"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-md transition-colors hover:opacity-70"
                        style={{ color: 'var(--accent)' }}
                        title="Delete project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <p className="text-center py-8 sans" style={{ color: 'var(--text-muted)' }}>
                No projects yet. Create one above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
