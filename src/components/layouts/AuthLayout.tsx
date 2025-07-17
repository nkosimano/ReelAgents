import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary/10 dark:from-neutral-900 dark:to-primary/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h1>
            {subtitle && (
              <p className="text-neutral-600 dark:text-neutral-400">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};