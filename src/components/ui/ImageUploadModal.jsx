import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUploadModal = ({ isOpen, onClose, onSubmit }) => {
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
        croppingShowDimensions: true,
        croppingValidateDimensions: true,
        showSkipCropButton: false,
        // Use eager transformation for optimized images
        eager: [
          { width: 800, height: 600, crop: "fill" }
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
          onSubmit(imageUrl);
          onClose();
        }
      }
    );

    widget.open();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#131E2B] rounded-lg p-6 w-full max-w-md border border-[#2C5282]/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white font-['Space_Grotesk']">Add Image</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleImageUpload}
            className="flex items-center justify-center w-full p-8 border-2 border-dashed 
                     border-[#63B3ED]/20 rounded-lg cursor-pointer
                     hover:border-[#63B3ED]/40 transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-[#63B3ED]" size={32} />
              <span className="text-[#63B3ED] font-['Space_Grotesk']">Upload Image</span>
            </div>
          </button>
          
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-['Space_Grotesk']"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;