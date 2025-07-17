import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { User as SupabaseUser } from '@supabase/supabase-js';

// JWT payload interface for role extraction
interface JWTPayload {
  sub: string;
  email: string;
  user_metadata?: {
    role?: string;
  };
  app_metadata?: {
    role?: string;
  };
  role?: string;
  exp: number;
  iat: number;
}

export const useAuth = () => {
  const { user, profile, loading, setUser, setProfile, setLoading } = useAuthStore();

  // Parse JWT to extract role information
  const parseJWTRole = (user: SupabaseUser | null): string | null => {
    if (!user?.access_token) return null;
    
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(
        atob(user.access_token.split('.')[1])
      ) as JWTPayload;
      
      // Check multiple possible locations for role
      return payload.user_metadata?.role || 
             payload.app_metadata?.role || 
             payload.role || 
             null;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    getInitialSession();

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().signOut();
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    isCompany: profile?.role === 'company',
    isAgent: profile?.role === 'agent',
    isAdmin: profile?.role === 'admin',
    // Additional role checks from JWT
    jwtRole: parseJWTRole(user),
    hasRole: (role: string) => profile?.role === role || parseJWTRole(user) === role,
    canAccess: (requiredRoles: string[]) => {
      const userRole = profile?.role || parseJWTRole(user);
      return userRole ? requiredRoles.includes(userRole) : false;
    },
  };
};