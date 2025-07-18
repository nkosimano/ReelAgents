import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
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
      <div className={styles.selectWrapper}>
        <select
          className={`
            ${styles.select}
            ${error 
              ? styles['select--error']
              : styles['select--normal']
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={`
                ${styles.option}
                ${option.disabled ? styles['option--disabled'] : ''}
              `}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.selectIcon} />
      </div>
      {error && (
        <p className={styles.errorText}>{error}</p>
      )}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
};