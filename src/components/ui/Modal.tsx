import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClass = `modal-${size}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="modal-container">
        {/* Backdrop */}
        <div 
          className="modal-backdrop"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`modal-content ${sizeClass}`}>
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              onClick={onClose}
              className="modal-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};