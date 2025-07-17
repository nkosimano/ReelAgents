import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabaseClient';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
<<<<<<< HEAD
                brand: '#4f46e5',
                brandAccent: '#4338ca',
=======
                brand: 'var(--tw-color-secondary)',
                brandAccent: 'var(--tw-color-secondary)',
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
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
      <div className="mt-6 text-center">
<<<<<<< HEAD
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
=======
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <a href="/auth/signup" className="font-medium text-secondary hover:text-secondary/90">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};