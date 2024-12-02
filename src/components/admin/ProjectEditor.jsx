// src/components/admin/ProjectEditor.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ProjectEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing projects
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title,
        description,
        technologies: technologies.split(',').map(tech => tech.trim()),
        createdAt: new Date().toISOString(),
      });
      setTitle('');
      setDescription('');
      setTechnologies('');
      alert('Project created successfully!');
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        alert('Project deleted successfully!');
        fetchProjects(); // Refresh the list
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">Create Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-32"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="React, Node.js, Firebase"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-purple-400">Existing Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-gray-300 mt-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;