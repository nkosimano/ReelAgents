import { create } from 'zustand';
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

interface AuthState {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  profile: Database['public']['Tables']['users']['Row'] | null;
  loading: boolean;
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: SupabaseSession | null) => void;
  setProfile: (profile: Database['public']['Tables']['users']['Row'] | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: () => set({ user: null, session: null, profile: null }),
}));