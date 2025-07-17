import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { useAuth } from '../useAuth';
import { useEffect } from 'react';

export const useCampaigns = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Database['public']['Tables']['campaigns']['Row'][]>({
    queryKey: ['campaigns', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!profile?.company_id) return;

    const channel = supabase
      .channel('campaigns_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns',
          filter: `company_id=eq.${profile.company_id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', profile.company_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.company_id, queryClient]);

  return query;
};

export const useCreateCampaign = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      budget: number;
      target_audience?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Company ID not found');
      }

      const response = await apiClient.createCampaign({
        ...data,
        company_id: profile.company_id,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', profile?.company_id] });
    },
  });
};