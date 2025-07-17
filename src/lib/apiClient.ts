import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || 'Request failed',
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Digital Twins API
  async createDigitalTwin(data: {
    name: string;
    company_id: string;
    training_data_url: string;
    description?: string;
  }): Promise<ApiResponse<{ job_id: string; digital_twin_id: string }>> {
    return this.request('/api/digital-twins/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDigitalTwins(companyId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/digital-twins?company_id=${companyId}`);
  }

  // Campaigns API
  async createCampaign(data: {
    name: string;
    company_id: string;
    description?: string;
    budget: number;
    target_audience?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/api/campaigns/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCampaigns(companyId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/campaigns?company_id=${companyId}`);
  }

  // Job Status API (for tracking async operations)
  async getJobStatus(jobId: string): Promise<ApiResponse<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    result?: any;
    error?: string;
  }>> {
    return this.request(`/api/jobs/${jobId}/status`);
  }
}

export const apiClient = new ApiClient();