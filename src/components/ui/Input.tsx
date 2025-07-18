import React from 'react';

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
    <div className="form-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        className={`
          input
          ${error 
            ? 'input-error' 
            : 'input-normal'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="input-error-text">{error}</p>
      )}
      {helperText && !error && (
        <p className="input-helper">{helperText}</p>
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
    <div className="form-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <textarea
        className={`
          input resize-none
          ${error 
            ? 'input-error' 
            : 'input-normal'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="input-error-text">{error}</p>
      )}
      {helperText && !error && (
        <p className="input-helper">{helperText}</p>
      )}
    </div>
  );
};