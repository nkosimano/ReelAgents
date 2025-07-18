import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { ArrowLeft, Mail } from 'lucide-react';
import styles from './Login.module.css';

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
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <Mail className={styles.successIconSvg} />
          </div>
          <p className={styles.successText}>
            If an account with email <span className={styles.emailHighlight}>{email}</span> exists, you will receive a password reset link shortly.
          </p>
          <a
            href="/auth/login"
            className={styles.backLink}
          >
            <ArrowLeft className={styles.backIcon} />
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
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {error && (
          <div className={styles.errorAlert}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className={styles.authFooter}>
        <a
          href="/auth/login"
          className={styles.backLink}
        >
          <ArrowLeft className={styles.backIcon} />
          Back to sign in
        </a>
      </div>
    </AuthLayout>
  );
};