import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { X, Menu, ArrowRight } from 'lucide-react';

const MobileNav = ({ isOpen, onClose }) => (
  <div className={`fixed inset-0 bg-[#0F1620]/95 backdrop-blur-sm z-50 lg:hidden transition-all duration-300 ${
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}>
    <div className="flex justify-end p-6">
      <button onClick={onClose} className="text-[#63B3ED] hover:text-white transition-all duration-300">
        <X size={24} />
      </button>
    </div>
    <nav className="flex flex-col items-center space-y-8 pt-12">
      {['Home', 'About', 'Blog'].map((item) => (
        <Link
          key={item}
          to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
          onClick={onClose}
          className="text-2xl text-[#63B3ED] hover:text-white transition-all duration-300 font-['Space_Grotesk']"
        >
          {item}
        </Link>
      ))}
    </nav>
  </div>
);

const TagButton = ({ tag, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm
              transition-all duration-300 cursor-pointer relative z-20
              ${isSelected
                ? 'bg-[#63B3ED] text-white hover:bg-[#63B3ED]/90'
                : 'bg-[#0F1620] text-[#63B3ED] hover:bg-[#63B3ED]/10'
              } border border-[#2C5282]/10 font-['Space_Grotesk']`}
  >
    #{tag.name}{tag.emoji}
  </button>
);

const BlogPreview = ({ post }) => (
  <Link
    to={`/blog/${post.id}`}
    className="block bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
              hover:border-[#2C5282]/30 transition-all duration-500 
              transform relative group p-6 sm:p-8"
  >
    <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#63B3ED] to-transparent group-hover:h-16 transition-all duration-500"/>
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#63B3ED] to-transparent group-hover:w-16 transition-all duration-500"/>
    </div>

    <div className="flex items-center justify-between mb-4">
      <div className="text-[#63B3ED] text-sm font-['Space_Grotesk']">
        {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <ArrowRight 
        className="text-[#63B3ED] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" 
        size={20} 
      />
    </div>
    
    <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#63B3ED] transition-colors">
      {post.title}
    </h2>

    {post.tags && post.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-[#0F1620] text-[#63B3ED] text-sm rounded-full 
                     border border-[#2C5282]/10 font-['Space_Grotesk']"
          >
            #{tag.name}{tag.emoji}
          </span>
        ))}
      </div>
    )}
  </Link>
);
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
  };

  const clearFilter = () => {
    setActiveTag(null);
  };

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter(post => 
      post.tags?.some(tag => tag.name === activeTag.name)
    );
  }, [posts, activeTag]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0F1620] relative overflow-hidden">
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F1620]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center lg:hidden">
            <Link to="/" className="text-[#63B3ED] font-['Space_Grotesk'] text-xl">
              Portfolio
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#63B3ED] hover:text-white transition-all duration-300"
            >
              <Menu size={24} />
            </button>
          </div>
          <ul className="hidden lg:flex space-x-12">
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

      <div className="max-w-7xl mx-auto pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 sm:mb-16 lg:mb-24">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            Blog
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-4 sm:-top-6 lg:-top-8 -left-2 sm:-left-3 lg:-left-4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 border-2 border-[#63B3ED]/20 rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#63B3ED]/40 rounded-full pointer-events-none" />
          <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 right-1/4 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#63B3ED]/30 rounded-full pointer-events-none" />
        </div>

        {!loading && allTags.length > 0 && (
          <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-wrap gap-2 sm:gap-3 items-center relative z-20">
            {activeTag && (
              <button
                type="button"
                onClick={clearFilter}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#131E2B] text-red-400 
                         hover:bg-red-400/10 border border-red-400/20 
                         transition-all duration-300 font-['Space_Grotesk'] text-xs sm:text-sm
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
              <BlogPreview key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;