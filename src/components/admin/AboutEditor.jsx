import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Upload, X } from 'lucide-react';

const AboutEditor = () => {
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    name: '',
    introduction: '',
    experience: '',
    skills: '',
    imageUrl: ''
  });

  useEffect(() => {
    // Load Cloudinary widget script
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
        maxFileSize: 5000000, // 5MB
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        croppingValidateDimensions: true,
        showSkipCropButton: false,
        // These settings ensure we get the cropped version
        eager: [
          { width: 256, height: 256, crop: "fill" }
        ],
        // Use the eager transformation
        useJsonP: true,
        eager_async: true,
        return_delete_token: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Use the eager transformed URL if available
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
      <div className="relative mb-12">
        <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
          Edit About Page
          <span className="text-[#63B3ED]">.</span>
        </h1>
        <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Name</label>
          <input
            type="text"
            name="name"
            value={aboutData.name}
            onChange={handleChange}
            className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">Profile Image</label>
          <div className="space-y-4">
            {aboutData.imageUrl ? (
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#63B3ED]/20">
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
                  className="flex items-center justify-center w-32 h-32 rounded-full
                           border-2 border-dashed border-[#63B3ED]/20 cursor-pointer
                           hover:border-[#63B3ED]/40 transition-all duration-300"
                >
                  <Upload className="text-[#63B3ED]" size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">
            Introduction
            <span className="text-sm text-gray-400 ml-2">(Who you are, what you do)</span>
          </label>
          <textarea
            name="introduction"
            value={aboutData.introduction}
            onChange={handleChange}
            className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">
            Experience
            <span className="text-sm text-gray-400 ml-2">(Your journey and achievements)</span>
          </label>
          <textarea
            name="experience"
            value={aboutData.experience}
            onChange={handleChange}
            className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300 h-48"
            required
          />
        </div>

        <div>
          <label className="block text-[#63B3ED] mb-2 font-['Space_Grotesk']">
            Skills (comma-separated)
            <span className="text-sm text-gray-400 ml-2">(Technologies, tools, expertise)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={aboutData.skills}
            onChange={handleChange}
            placeholder="JavaScript, React, Node.js"
            className="w-full p-3 bg-[#131E2B] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white rounded-lg 
                    transition-all duration-300 font-['Space_Grotesk'] relative overflow-hidden group"
        >
          <span className="relative z-10">
            {loading ? 'Updating...' : 'Update About Page'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
      </form>
    </div>
  );
};

export default AboutEditor;