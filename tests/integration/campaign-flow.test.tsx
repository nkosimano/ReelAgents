import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Campaigns } from '../../src/pages/company/Campaigns';
import { useAuth } from '../../src/hooks/useAuth';
import { useCampaigns, useCreateCampaign } from '../../src/hooks/queries/useCampaigns';

// Mock the hooks
vi.mock('../../src/hooks/useAuth');
vi.mock('../../src/hooks/queries/useCampaigns');

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Campaign Flow Integration', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as any).mockReturnValue({
      profile: {
        id: '1',
        email: 'company@test.com',
        role: 'company',
        company_id: 'company-1',
      },
      isCompany: true,
    });

    (useCampaigns as any).mockReturnValue({
      data: [
        {
          id: '1',
          name: 'Test Campaign',
          description: 'Test description',
          budget: 5000,
          status: 'draft',
          created_at: '2024-01-01',
        },
      ],
      isLoading: false,
    });

    (useCreateCampaign as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });
  });

  it('displays existing campaigns correctly', () => {
    render(
      <TestWrapper>
        <Campaigns />
      </TestWrapper>
    );

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('handles campaign creation flow', async () => {
    mockMutateAsync.mockResolvedValue({
      id: '2',
      name: 'New Campaign',
      budget: 10000,
    });

    render(
      <TestWrapper>
        <Campaigns />
      </TestWrapper>
    );

    // Open campaign wizard
    fireEvent.click(screen.getByText('New Campaign'));

    // Fill out form
    fireEvent.change(screen.getByLabelText(/campaign name/i), {
      target: { value: 'New Campaign' },
    });

    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: '10000' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Campaign'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'New Campaign',
        description: '',
        budget: 10000,
        target_audience: '',
        start_date: '',
        end_date: '',
      });
    });
  });

  it('handles campaign view details', () => {
    render(
      <TestWrapper>
        <Campaigns />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('View Details'));
    
    // Should navigate to campaign details view
    expect(screen.getByText('Campaign Details')).toBeInTheDocument();
  });
});