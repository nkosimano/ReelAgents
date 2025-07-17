import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { useAuth } from '../useAuth';
import { useEffect } from 'react';

export const useDigitalTwins = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Database['public']['Tables']['digital_twins']['Row'][]>({
    queryKey: ['digitalTwins', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];
      
      const { data, error } = await supabase
        .from('digital_twins')
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
      .channel('digital_twins_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'digital_twins',
          filter: `company_id=eq.${profile.company_id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['digitalTwins', profile.company_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.company_id, queryClient]);

  return query;
};

export const useCreateDigitalTwin = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      training_data_url: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Company ID not found');
      }

      const response = await apiClient.createDigitalTwin({
        ...data,
        company_id: profile.company_id,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onMutate: async (newTwin) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['digitalTwins', profile?.company_id] });

      // Snapshot previous value
      const previousTwins = queryClient.getQueryData(['digitalTwins', profile?.company_id]);

      // Optimistically update
      const optimisticTwin = {
        id: `temp-${Date.now()}`,
        name: newTwin.name,
        description: newTwin.description || '',
        status: 'pending' as const,
        company_id: profile?.company_id || '',
        agent_id: null,
        training_data_url: newTwin.training_data_url,
        model_endpoint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ['digitalTwins', profile?.company_id],
        (old: any[]) => [optimisticTwin, ...(old || [])]
      );

      return { previousTwins };
    },
    onError: (err, newTwin, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['digitalTwins', profile?.company_id],
        context?.previousTwins
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['digitalTwins', profile?.company_id] });
    },
  });
};