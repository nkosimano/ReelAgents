import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && (
              <p className={styles.subtitle}>{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};