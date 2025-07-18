import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

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
  const { user, session, profile, loading, setUser, setSession, setProfile, setLoading } = useAuthStore();

  // Parse JWT to extract role information
  const parseJWTRole = (accessToken: string | null | undefined): string | null => {
    if (!accessToken) return null;
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(
        atob(accessToken.split('.')[1])
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
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false); // Only set loading to false after profile is fetched or cleared
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true); // Set loading to true at the start of auth state change
        setUser(session?.user ?? null);
        setSession(session ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false); // Only set loading to false after profile is fetched or cleared
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setProfile, setLoading]);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      console.log('Fetched user profile:', data);
      setProfile(data as Database['public']['Tables']['users']['Row']);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().signOut();
  };

  const accessToken = session?.access_token;

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    isCompany: profile?.role === 'company',
    isAgent: profile?.role === 'agent',
    isAdmin: profile?.role === 'admin',
    // Additional role checks from JWT
    jwtRole: parseJWTRole(accessToken),
    hasRole: (role: string) => profile?.role === role || parseJWTRole(accessToken) === role,
    canAccess: (requiredRoles: string[]) => {
      const userRole = profile?.role || parseJWTRole(accessToken);
      return userRole ? requiredRoles.includes(userRole) : false;
    },
  };
};