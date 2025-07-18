import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <input
        className={`
          ${styles.input}
          ${error 
            ? styles['input--error']
            : styles['input--normal']
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className={styles.errorText}>{error}</p>
      )}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        className={`
          ${styles.input} ${styles.textarea}
          ${error 
            ? styles['input--error']
            : styles['input--normal']
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className={styles.errorText}>{error}</p>
      )}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
};