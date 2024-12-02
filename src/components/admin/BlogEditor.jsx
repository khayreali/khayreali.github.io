// src/components/admin/BlogEditor.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing blogs
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date, newest first
      blogsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
    // Get local date in YYYY-MM-DD format without any timezone conversion
    const today = new Date();
    const localDate = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
    setDate(localDate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Store the date exactly as selected without any timezone conversion
      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        date: date, // Store the raw date string from the input
        createdAt: new Date().toISOString(),
      });
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      alert('Blog post created successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        alert('Blog post deleted successfully!');
        fetchBlogs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">Create Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-300 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            required
            disabled={loading}
          />
        </div>
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
          <label className="block text-gray-300 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-64"
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
          {loading ? 'Creating...' : 'Create Blog Post'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-purple-400">Existing Blog Posts</h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                <div className="text-gray-400 text-sm">
                  {new Date(blog.date + 'T00:00:00').toLocaleDateString()}
                </div>
                  <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
                  <p className="text-gray-300 mt-2 line-clamp-3">{blog.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(blog.id)}
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

export default BlogEditor;