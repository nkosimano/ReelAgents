import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

interface AsyncOperationState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  progress: number;
}

interface UseAsyncOperationReturn<T> {
  state: AsyncOperationState<T>;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useAsyncOperation<T = any>(
  operation: (...args: any[]) => Promise<{ job_id?: string; data?: T }>,
  options: {
    pollInterval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
): UseAsyncOperationReturn<T> {
  const { pollInterval = 2000, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    progress: 0,
  });

  const pollJobStatus = useCallback(async (jobId: string) => {
    const pollStatus = async () => {
      const response = await apiClient.getJobStatus(jobId);
      
      if (response.error) {
        setState(prev => ({ ...prev, loading: false, error: response.error! }));
        onError?.(response.error);
        return;
      }

      const { status, progress = 0, result, error } = response.data!;

      setState(prev => ({ ...prev, progress }));

      switch (status) {
        case 'completed':
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            data: result, 
            progress: 100 
          }));
          onSuccess?.(result);
          break;
          
        case 'failed':
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: error || 'Operation failed' 
          }));
          onError?.(error || 'Operation failed');
          break;
          
        case 'pending':
        case 'running':
          // Continue polling
          setTimeout(pollStatus, pollInterval);
          break;
      }
    };

    pollStatus();
  }, [pollInterval, onSuccess, onError]);

  const execute = useCallback(async (...args: any[]) => {
    setState({
      data: null,
      loading: true,
      error: null,
      progress: 0,
    });

    try {
      const result = await operation(...args);
      
      if (result.job_id) {
        // Async operation - start polling
        pollJobStatus(result.job_id);
      } else {
        // Sync operation - immediate result
        setState({
          data: result.data || null,
          loading: false,
          error: null,
          progress: 100,
        });
        onSuccess?.(result.data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        progress: 0,
      });
      onError?.(errorMessage);
    }
  }, [operation, pollJobStatus, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      progress: 0,
    });
  }, []);

  return { state, execute, reset };
}