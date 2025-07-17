import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { ArrowLeft, Mail } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
<<<<<<< HEAD
          <p className="text-gray-600 mb-6">
=======
          <p className="text-neutral-600 mb-6">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            If an account with email <strong>{email}</strong> exists, you will receive a password reset link shortly.
          </p>
          <a
            href="/auth/login"
<<<<<<< HEAD
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
=======
            className="inline-flex items-center text-secondary hover:text-secondary/90 font-medium"
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
<<<<<<< HEAD
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
=======
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
<<<<<<< HEAD
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
=======
            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
<<<<<<< HEAD
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
=======
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="/auth/login"
<<<<<<< HEAD
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
=======
          className="inline-flex items-center text-secondary hover:text-secondary/90 font-medium"
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </a>
      </div>
    </AuthLayout>
  );
};