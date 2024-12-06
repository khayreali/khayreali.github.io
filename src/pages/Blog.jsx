import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { X, ChevronDown } from 'lucide-react';

const TagButton = ({ tag, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm
              transition-all duration-300 cursor-pointer relative z-20
              ${isSelected
                ? 'bg-[#63B3ED] text-white hover:bg-[#63B3ED]/90'
                : 'bg-[#0F1620] text-[#63B3ED] hover:bg-[#63B3ED]/10'
              } border border-[#2C5282]/10 font-['Space_Grotesk']`}
  >
    #{tag.name}{tag.emoji}
  </button>
);

const BlogPost = ({ post, isExpanded, onToggle }) => (
  <article
    className={`bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
              hover:border-[#2C5282]/30 transition-all duration-500 
              transform relative group cursor-pointer
              ${isExpanded ? 'p-8' : 'p-6'}`}
    onClick={onToggle}
  >
    <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
    </div>

    <div className="flex items-center justify-between mb-2">
      <div className="text-[#63B3ED] text-sm font-['Space_Grotesk']">
        {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <ChevronDown 
        className={`text-[#63B3ED] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
        size={20} 
      />
    </div>
    
    <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk'] group-hover:text-[#63B3ED] transition-colors">
      {post.title}
    </h2>

    {post.tags && post.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#0F1620] text-[#63B3ED] text-sm rounded-full 
                     border border-[#2C5282]/10 font-['Space_Grotesk']"
            onClick={(e) => e.stopPropagation()}
          >
            #{tag.name}{tag.emoji}
          </span>
        ))}
      </div>
    )}

    <div 
      className={`overflow-hidden transition-all duration-500 ease-in-out
                ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className="prose prose-invert max-w-none pt-4 border-t border-[#2C5282]/10">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph ? (
            <p key={index} className="text-gray-300 mb-4 font-['Space_Grotesk'] leading-relaxed">
              {paragraph}
            </p>
          ) : null
        ))}
      </div>
    </div>
  </article>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const postsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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

  const allTags = useMemo(() => {
    const uniqueTags = new Map();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          uniqueTags.set(tag.name, tag);
        });
      }
    });
    return Array.from(uniqueTags.values());
  }, [posts]);

  const handleTagClick = (tag) => {
    setActiveTag(current => current?.name === tag.name ? null : tag);
    setExpandedPostId(null); // Close expanded post when changing tags
  };

  const clearFilter = () => {
    setActiveTag(null);
    setExpandedPostId(null); // Close expanded post when clearing filter
  };

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter(post => 
      post.tags?.some(tag => tag.name === activeTag.name)
    );
  }, [posts, activeTag]);

  const togglePost = (postId) => {
    setExpandedPostId(current => current === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1620]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <ul className="flex space-x-12">
            {['Home', 'About', 'Blog'].map((item) => (
              <li key={item} className="relative group">
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="text-[#63B3ED] hover:text-white transition-all duration-300 font-['Space_Grotesk']"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#63B3ED] group-hover:w-full transition-all duration-300"/>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-32 px-8">
        <div className="relative mb-24">
          <h1 className="text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            Blog
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-8 -left-4 w-24 h-24 border-2 border-[#63B3ED]/20 rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#63B3ED]/40 rounded-full pointer-events-none" />
          <div className="absolute -bottom-4 right-1/4 w-12 h-12 border-2 border-[#63B3ED]/30 rounded-full pointer-events-none" />
        </div>

        {!loading && allTags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3 items-center relative z-20">
            {activeTag && (
              <button
                type="button"
                onClick={clearFilter}
                className="px-4 py-2 rounded-full bg-[#131E2B] text-red-400 
                         hover:bg-red-400/10 border border-red-400/20 
                         transition-all duration-300 font-['Space_Grotesk'] text-sm
                         flex items-center gap-2 cursor-pointer relative z-20"
              >
                <X size={14} />
                Clear Filter
              </button>
            )}
            {allTags.map((tag) => (
              <TagButton
                key={tag.name}
                tag={tag}
                isSelected={activeTag?.name === tag.name}
                onClick={() => handleTagClick(tag)}
              />
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
            <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading posts...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <BlogPost
                key={post.id}
                post={post}
                isExpanded={expandedPostId === post.id}
                onToggle={() => togglePost(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;