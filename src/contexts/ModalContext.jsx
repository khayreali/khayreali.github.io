// src/contexts/ModalContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

const ModalContext = createContext({});

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const StyledModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  confirmText = 'Confirm',
  confirmStyle = 'primary', // 'primary' | 'danger'
}) => {
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

        <p className="text-gray-300 mb-6 font-['Space_Grotesk']">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-['Space_Grotesk']"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-['Space_Grotesk'] transition-all duration-300 relative overflow-hidden group
              ${confirmStyle === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white'}`}
          >
            <span className="relative z-10">{confirmText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    confirmStyle: 'primary',
  });

  const showModal = ({
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    confirmStyle = 'primary'
  }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm?.();
        closeModal();
      },
      confirmText,
      confirmStyle,
    });
  };

  const showConfirmModal = ({
    title = 'Confirm Action',
    message,
    onConfirm,
    confirmText = 'Confirm',
    confirmStyle = 'primary'
  }) => {
    showModal({
      title,
      message,
      onConfirm,
      confirmText,
      confirmStyle,
    });
  };

  const showDeleteConfirmModal = ({
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    onConfirm,
  }) => {
    showModal({
      title,
      message,
      onConfirm,
      confirmText: 'Delete',
      confirmStyle: 'danger',
    });
  };

  const showSuccessModal = (message) => {
    showModal({
      title: 'Success',
      message,
      confirmText: 'OK',
    });
  };

  const showErrorModal = (message) => {
    showModal({
      title: 'Error',
      message,
      confirmText: 'OK',
      confirmStyle: 'danger',
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <ModalContext.Provider value={{
      showModal,
      showConfirmModal,
      showDeleteConfirmModal,
      showSuccessModal,
      showErrorModal,
      closeModal,
    }}>
      {children}
      <StyledModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        confirmStyle={modalConfig.confirmStyle}
      />
    </ModalContext.Provider>
  );
};