import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold, Italic, Link as LinkIcon, Heading1, Heading2, 
  List, ListOrdered, Image as ImageIcon, ArrowLeft, Save,
  Code, Quote
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter the URL:');
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
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
        onClick={setLink}
        className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
          editor.isActive('link') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
        }`}
      >
        <LinkIcon size={16} />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-[#0F1620] transition-colors text-white"
      >
        <ImageIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
          editor.isActive('codeBlock') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
        }`}
      >
        <Code size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-[#0F1620] transition-colors ${
          editor.isActive('blockquote') ? 'bg-[#0F1620] text-[#63B3ED]' : 'text-white'
        }`}
      >
        <Quote size={16} />
      </button>
    </div>
  );
};

const IdeaEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [idea, setIdea] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image
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
          'prose-li:text-white'
        ].join(' ')
      }
    }
  });

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const docRef = doc(db, 'todos', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIdea({
            id: docSnap.id,
            ...data,
            content: data.content || '',
            notes: data.notes || ''
          });
          
          editor?.commands.setContent(data.notes || '');
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    if (editor) {
      fetchIdea();
    }
  }, [id, editor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const content = editor.getHTML();
      await updateDoc(doc(db, 'todos', id), {
        notes: content,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1620] p-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#63B3ED] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[#63B3ED] font-['Space_Grotesk']">Loading idea...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1620] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-[#63B3ED] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#63B3ED] text-white rounded-lg 
                     hover:bg-[#63B3ED]/90 transition-all duration-300 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="bg-[#131E2B] rounded-lg p-6 border border-[#2C5282]/20">
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-2
                          ${idea.type === 'feature' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                           idea.type === 'bug' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                           idea.type === 'business' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                           'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}
            >
              {idea.type}
            </span>
            <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              {idea.content}
            </h1>
          </div>

          <div className="bg-[#0F1620] rounded-lg border border-[#2C5282]/20 p-4">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaEditor;



