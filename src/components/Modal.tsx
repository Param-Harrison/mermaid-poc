import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70" 
        onClick={onClose}
        aria-hidden="true" 
      />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 