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
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm transition-colors bg-white dark:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary
          text-neutral-900 dark:text-neutral-100
          ${error 
            ? 'border-danger focus:ring-danger focus:border-danger' 
            : 'border-neutral-300 dark:border-neutral-600'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
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
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm transition-colors resize-none bg-white dark:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary
          text-neutral-900 dark:text-neutral-100
          ${error 
            ? 'border-danger focus:ring-danger focus:border-danger' 
            : 'border-neutral-300 dark:border-neutral-600'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
    </div>
  );
};