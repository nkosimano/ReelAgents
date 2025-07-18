import React from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className={styles.container}>
        {/* Backdrop */}
        <div 
          className={`${styles.backdrop} ${styles.fadeIn}`}
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`${styles.content} ${styles[`content--${size}`]} ${styles.slideUp}`}>
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className={styles.body}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};