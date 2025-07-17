import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be generated from Supabase later)
export interface User {
  id: string;
  email: string;
  role: 'company' | 'agent' | 'admin';
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  stripe_account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  company_id?: string;
  name: string;
  specialization: string;
  certification_status: 'pending' | 'certified' | 'rejected';
  stripe_account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalTwin {
  id: string;
  company_id: string;
  agent_id?: string;
  name: string;
  description: string;
  status: 'pending' | 'training' | 'active' | 'failed';
  training_data_url?: string;
  model_endpoint?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  company_id: string;
  name: string;
  description: string;
  budget: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  target_audience: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}