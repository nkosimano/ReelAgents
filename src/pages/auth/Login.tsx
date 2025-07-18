import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabaseClient';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your ReelAgents account"
    >
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'var(--tw-color-secondary, #2563eb)', // fallback to blue-600
                brandAccent: 'var(--tw-color-secondary, #2563eb)',
                inputText: '#111827',
                inputLabelText: '#111827',
                buttonText: '#fff',
                buttonBackground: '#2563eb', // blue-600
                buttonBackgroundHover: '#1d4ed8', // blue-700
                buttonBorder: '#2563eb',
                anchorText: '#2563eb',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/dashboard`}
        onlyThirdPartyProviders={false}
        magicLink={false}
        view="sign_in"
      />
      <div className={styles.authFooter}>
        <p className={styles.footerText}>
          Don't have an account?{' '}
          <a href="/auth/signup" className={styles.footerLink}>
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};