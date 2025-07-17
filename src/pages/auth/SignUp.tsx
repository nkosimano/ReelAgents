import React from 'react';

export const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Sign Up</h2>
        {/* TODO: Add Supabase Auth UI or custom sign up form here */}
        <p className="text-neutral-600 dark:text-neutral-300">Sign up functionality coming soon.</p>
      </div>
    </div>
  );
};

export default SignUp;
