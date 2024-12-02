// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const postsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by date, newest first
        postsList.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-purple-400 hover:text-purple-300">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-purple-400 hover:text-purple-300">About</Link>
          </li>
          <li>
            <Link to="/blog" className="text-purple-400 hover:text-purple-300">Blog</Link>
          </li>
        </ul>
      </nav>

      <h1 className="text-4xl font-bold text-purple-400 mb-8">Blog</h1>

      {loading ? (
        <div className="text-purple-400">Loading posts...</div>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article 
                key={post.id} 
                className="bg-gray-800 rounded-lg p-6 border border-purple-500/20"
            >
                <div className="text-xl font-bold text-purple-300 mb-1">
                {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                </div>
              <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
              <div className="prose prose-invert max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="text-gray-300 mb-4">{paragraph}</p> : null
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;