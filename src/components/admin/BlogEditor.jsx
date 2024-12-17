import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { PlusCircle, X, Loader2, Bold, Italic, Link as LinkIcon, Heading1, Heading2, 
         List, ListOrdered, Image as ImageIcon, Save, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';  // Renamed to avoid conflict
import Image from '@tiptap/extension-image';
import Modal from '../ui/Modal';
import ImageUploadModal from '../ui/ImageUploadModal';

const PRESET_TAGS = [
  { name: 'books', emoji: '📚' },
  { name: 'coding', emoji: '💻' },
  { name: 'design', emoji: '🎨' },
  { name: 'life', emoji: '🌱' },
  { name: 'tech', emoji: '⚡' }
];

const MenuBar = ({ editor }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!editor) return null;

  const addImage = (url) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = (url) => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      finalUrl = `https://${url}`;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl, target: '_blank' }).run();
  };

  return (
    <>
      <div className="border-b border-[#2C5282]/20 p-2 mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('bold') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('italic') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => setShowLinkModal(true)}
          className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
            editor.isActive('link') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
          }`}
        >
          <LinkIcon size={16} />
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded hover:bg-[#0F1620] transition-colors text-white"
        >
          <ImageIcon size={16} />
        </button>
      </div>

      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={setLink}
        title="Add Link"
        placeholder="Enter the URL"
        buttonText="Add Link"
      />

      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSubmit={addImage}
      />
    </>
  );
};
const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: '', emoji: '' });
  const [isAddingTag, setIsAddingTag] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full cursor-pointer select-none hover:ring-2 hover:ring-[#63B3ED] transition-shadow',
        }
      })
    ],
    editorProps: {
      attributes: {
        class: [
          'prose',
          'prose-invert',
          'max-w-none',
          'min-h-[500px]',
          'focus:outline-none',
          'font-[\'Space_Grotesk\']',
          'prose-p:text-white',
          'prose-headings:text-white',
          'prose-headings:font-[\'Space_Grotesk\']',
          'prose-strong:text-white',
          'prose-em:text-white',
          'prose-pre:bg-[#0F1620]',
          'prose-blockquote:text-white',
          'prose-blockquote:border-[#63B3ED]',
          'prose-a:text-[#63B3ED]',
          'prose-code:text-white',
          'prose-li:text-white',
          'prose-ol:text-white',
          'prose-ul:text-white',
          'prose-bullet:text-white',
          'prose-marker:text-white',
          'prose-img:mx-auto',
          'prose-img:max-w-[80%]'
        ].join(' ')
      }
    }
  });

  // Fetch single blog post if in edit mode
  useEffect(() => {
    const fetchBlog = async () => {
      if (id && editor) {
        setInitialLoading(true);
        setEditMode(true);
        try {
          const docRef = doc(db, 'blogs', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setDate(data.date || '');
            setSelectedTags(data.tags || []);
            editor.commands.setContent(data.content || '');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          alert('Failed to fetch blog post');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchBlog();
  }, [id, editor]);

  // Fetch all blogs for the list
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      blogsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    if (!id) {
      fetchBlogs();
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;
    
    setLoading(true);
    const blogData = {
      title,
      content: editor.getHTML(),
      date,
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editMode) {
        await updateDoc(doc(db, 'blogs', id), blogData);
        alert('Blog post updated successfully!');
        navigate('/admin/blog');
      } else {
        blogData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'blogs'), blogData);
        setTitle('');
        editor.commands.setContent('');
        setSelectedTags([]);
        setDate(new Date().toISOString().split('T')[0]);
        alert('Blog post created successfully!');
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} blog post`);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        alert('Blog post deleted successfully!');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.find(t => t.name === tag.name)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.name !== tagToRemove.name));
  };

  const handleAddNewTag = () => {
    if (newTag.name && newTag.emoji) {
      handleTagSelect(newTag);
      setNewTag({ name: '', emoji: '' });
      setIsAddingTag(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0F1620] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading blog post...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1620]">
      <div className="max-w-4xl mx-auto pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
        {editMode && (
          <Link 
            to="/admin/blog"
            className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-white 
                     transition-all duration-300 mb-8 hover:translate-x-[-4px]"
          >
            <ArrowLeft size={20} />
            <span className="font-['Space_Grotesk']">Back to Blog Posts</span>
          </Link>
        )}

        <div className="relative mb-12">
          <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
            {editMode ? 'Edit Blog Post' : 'Create Blog Post'}
            <span className="text-[#63B3ED]">.</span>
          </h1>
          <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
              required
              disabled={loading}
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Content</label>
            <div className="bg-[#131E2B] rounded-lg border border-[#2C5282]/20 overflow-hidden">
              <MenuBar editor={editor} />
              <div className="p-4">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Tags</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-3 py-1.5 bg-[#0F1620] text-[#63B3ED] rounded-full
                         flex items-center gap-2 group"
                >
                  #{tag.name}{tag.emoji}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 transition-colors duration-300"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagSelect(tag)}
                  disabled={selectedTags.some(t => t.name === tag.name)}
                  className={`px-3 py-1.5 rounded-full border transition-all duration-300
                          ${selectedTags.some(t => t.name === tag.name)
                            ? 'bg-[#63B3ED]/20 text-gray-400 border-transparent cursor-not-allowed'
                            : 'bg-[#0F1620] text-[#63B3ED] border-[#2C5282]/20 hover:border-[#63B3ED]'
                          }`}
                >
                  #{tag.name}{tag.emoji}
                </button>
              ))}
              
              <button
                type="button"
                onClick={() => setIsAddingTag(true)}
                className="px-3 py-1.5 bg-[#0F1620] text-[#63B3ED] rounded-full
                       border border-[#2C5282]/20 hover:border-[#63B3ED]
                       flex items-center gap-2 transition-all duration-300"
              >
                <PlusCircle size={16} />
                Add Tag
              </button>
            </div>
            {isAddingTag && (
              <div className="mt-4 p-4 bg-[#131E2B] rounded-lg border border-[#2C5282]/20">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Tag name"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value.toLowerCase() })}
                    className="flex-1 p-2 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                              text-white focus:ring-2 focus:ring-[#63B3ED] transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Emoji"
                    value={newTag.emoji}
                    onChange={(e) => setNewTag({ ...newTag, emoji: e.target.value })}
                    className="w-24 p-2 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                              text-white focus:ring-2 focus:ring-[#63B3ED] transition-all duration-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddNewTag}
                      disabled={!newTag.name || !newTag.emoji}
                      className="px-4 py-2 bg-[#63B3ED] text-white rounded-lg
                               hover:bg-[#63B3ED]/90 transition-all duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTag(false);
                        setNewTag({ name: '', emoji: '' });
                      }}
                      className="px-4 py-2 bg-[#0F1620] text-[#63B3ED] rounded-lg
                               border border-[#2C5282]/20 hover:border-[#63B3ED]
                               transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Post' : 'Create Post')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </form>

        {!editMode && (
          <div className="mt-16">
            <div className="relative mb-8">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] relative z-10">
                Manage Blog Posts
                <span className="text-[#63B3ED]">.</span>
              </h2>
            </div>

            <div className="space-y-6">
              {blogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="bg-[#131E2B] rounded-xl border border-[#2C5282]/10 
                           hover:border-[#2C5282]/30 transition-all duration-300 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[#63B3ED] text-sm font-['Space_Grotesk']">
                        {new Date(blog.date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="text-xl font-semibold text-white font-['Space_Grotesk'] mt-1">
                        {blog.title}
                      </h3>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blog.tags.map((tag, index) => (
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
                      
                      <div 
                        className="text-gray-300 mt-3 line-clamp-2 font-['Space_Grotesk'] text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: blog.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...'
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        to={`/admin/blog/edit/${blog.id}`}
                        className="text-[#63B3ED] hover:text-white p-2 rounded-lg
                                 transition-colors duration-300 hover:bg-[#63B3ED]/10"
                      >
                        <Pencil size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
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

export default BlogEditor;