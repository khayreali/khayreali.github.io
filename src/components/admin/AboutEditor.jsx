import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Upload, X } from 'lucide-react';

const AboutEditor = () => {
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    name: '',
    introduction: '',
    imageUrl: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  const handleImageUpload = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfqrq9tlf',
        uploadPreset: 'personal_uploads',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        croppingValidateDimensions: true,
        showSkipCropButton: false,
        eager: [
          { width: 256, height: 256, crop: "fill" }
        ],
        useJsonP: true,
        eager_async: true,
        return_delete_token: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.eager ?
            result.info.eager[0].secure_url :
            result.info.secure_url;

          setAboutData(prev => ({
            ...prev,
            imageUrl: imageUrl
          }));
        }
      }
    );

    widget.open();
  };

  const handleRemoveImage = () => {
    if (!aboutData.imageUrl) return;

    if (window.confirm('Are you sure you want to remove this image?')) {
      setAboutData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'content', 'about'), {
        ...aboutData,
        updatedAt: new Date().toISOString()
      });
      alert('About page updated successfully!');
    } catch (error) {
      console.error('Error updating about page:', error);
      alert('Failed to update about page');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1
        className="text-3xl mb-10"
        style={{ color: 'var(--text-primary)' }}
      >
        Edit About Page
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
            Name
          </label>
          <input
            type="text"
            name="name"
            value={aboutData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--accent)'
            }}
            required
          />
        </div>

        <div>
          <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
            Profile Image
          </label>
          <div className="space-y-4">
            {aboutData.imageUrl ? (
              <div className="relative group">
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden"
                  style={{ border: '2px solid var(--border)' }}
                >
                  <img
                    src={aboutData.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X className="text-white" size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex items-center justify-center w-32 h-32 rounded-full cursor-pointer transition-all"
                  style={{
                    border: '2px dashed var(--border)',
                    color: 'var(--accent)'
                  }}
                >
                  <Upload size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 sans" style={{ color: 'var(--text-muted)' }}>
            Introduction
            <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>(Who you are, what you do)</span>
          </label>
          <textarea
            name="introduction"
            value={aboutData.introduction}
            onChange={handleChange}
            className="w-full p-3 rounded-md sans transition-all focus:outline-none focus:ring-2 h-32"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--accent)'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-md sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-primary)'
          }}
        >
          {loading ? 'Updating...' : 'Update About Page'}
        </button>
      </form>
    </div>
  );
};

export default AboutEditor;
