import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Clock } from 'lucide-react';

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1620] pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0F1620] pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="text-white font-['Space_Grotesk']">Post not found</div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-[#0F1620]">
      <div className="max-w-4xl mx-auto pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors mb-8
                     hover:translate-x-[-4px] transition-transform duration-300"
        >
          <ArrowLeft size={20} />
          <span className="font-['Space_Grotesk']">Back to Blog</span>
        </Link>

        <article className="bg-gradient-to-b from-[#131E2B] to-[#0F1620] rounded-xl 
                          border border-[#2C5282]/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-[#63B3ED] text-sm font-['Space_Grotesk']">
              {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={16} />
              <span className="font-['Space_Grotesk']">{readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-white to-gray-200 
                       font-['Space_Grotesk'] mb-6 leading-tight">
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#0F1620]/50 text-[#63B3ED] text-sm rounded-full 
                           border border-[#2C5282]/10 font-['Space_Grotesk']
                           shadow-lg shadow-[#63B3ED]/5"
                >
                  #{tag.name}{tag.emoji}
                </span>
              ))}
            </div>
          )}

          <div className="blog-content text-gray-200">
            <style jsx global>{`
              .blog-content h1 {
                font-size: 2em;
                font-weight: bold;
                margin: 1.5em 0 1em;
                color: white;
                padding-bottom: 0.5em;
                border-bottom: 1px solid rgba(99, 179, 237, 0.1);
              }
              .blog-content h2 {
                font-size: 1.5em;
                font-weight: bold;
                margin: 1.5em 0 1em;
                color: white;
              }
              .blog-content h3 {
                font-size: 1.25em;
                font-weight: bold;
                margin: 1.2em 0 0.8em;
                color: white;
              }
              .blog-content p {
                margin-bottom: 1.2em;
                line-height: 1.8;
                color: #E5E7EB;
              }
              .blog-content ul {
                list-style: none;
                margin: 1.2em 0;
                padding-left: 1em;
              }
              .blog-content ul li {
                position: relative;
                padding-left: 1.5em;
                margin-bottom: 0.8em;
                color: #E5E7EB;
              }
              .blog-content ul li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0.6em;
                height: 6px;
                width: 6px;
                border-radius: 50%;
                background-color: #63B3ED;
              }
              .blog-content ol {
                list-style-type: decimal;
                margin: 1.2em 0;
                padding-left: 1.5em;
                color: #E5E7EB;
              }
              .blog-content ol li {
                margin-bottom: 0.8em;
                padding-left: 0.5em;
              }
              .blog-content a {
                color: #63B3ED;
                text-decoration: none;
                border-bottom: 1px dashed #63B3ED;
                transition: border-bottom-color 0.3s ease;
              }
              .blog-content a:hover {
                border-bottom-color: transparent;
              }
              .blog-content blockquote {
                border-left: 4px solid #63B3ED;
                padding: 1em 1.5em;
                margin: 1.5em 0;
                background: rgba(99, 179, 237, 0.05);
                border-radius: 0 0.5em 0.5em 0;
                color: #E5E7EB;
                font-style: italic;
              }
              .blog-content code {
                background-color: rgba(15, 22, 32, 0.7);
                padding: 0.2em 0.4em;
                border-radius: 0.25em;
                font-family: 'JetBrains Mono', monospace;
                color: #63B3ED;
                font-size: 0.9em;
              }
              .blog-content pre {
                background-color: rgba(15, 22, 32, 0.7);
                padding: 1.5em;
                border-radius: 0.5em;
                overflow-x: auto;
                margin: 1.5em 0;
                border: 1px solid rgba(99, 179, 237, 0.1);
              }
              .blog-content pre code {
                background-color: transparent;
                padding: 0;
                color: #E5E7EB;
              }
              .blog-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5em;
                margin: 1.5em auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              }
              .blog-content strong {
                color: white;
                font-weight: bold;
              }
              .blog-content em {
                color: #E5E7EB;
                font-style: italic;
              }
            `}</style>
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;