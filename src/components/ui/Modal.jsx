import React, { useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, onSubmit, title, placeholder, buttonText }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setValue('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#131E2B] rounded-lg p-6 w-full max-w-md border border-[#2C5282]/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white font-['Space_Grotesk']">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300 mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-['Space_Grotesk']"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#63B3ED] text-white rounded-lg 
                       hover:bg-[#63B3ED]/90 transition-all duration-300 font-['Space_Grotesk']"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;