import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DigitalTwinUploader } from '../DigitalTwinUploader';
import { useCreateDigitalTwin } from '../../../hooks/queries/useDigitalTwins';
import { useUIStore } from '../../../store/uiStore';

// Mock the hooks
vi.mock('../../../hooks/queries/useDigitalTwins');
vi.mock('../../../store/uiStore');

describe('DigitalTwinUploader Component', () => {
  const mockMutateAsync = vi.fn();
  const mockSetCreateTwinModalOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useCreateDigitalTwin as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });

    (useUIStore as any).mockReturnValue({
      isCreateTwinModalOpen: false,
      setCreateTwinModalOpen: mockSetCreateTwinModalOpen,
    });
  });

  it('renders the upload card correctly', () => {
    render(<DigitalTwinUploader />);
    
    expect(screen.getByText('Create Digital Twin')).toBeInTheDocument();
    expect(screen.getByText('Begin AI Training')).toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    render(<DigitalTwinUploader />);
    
    fireEvent.click(screen.getByText('Begin AI Training'));
    expect(mockSetCreateTwinModalOpen).toHaveBeenCalledWith(true);
  });

  it('renders modal when open', () => {
    (useUIStore as any).mockReturnValue({
      isCreateTwinModalOpen: true,
      setCreateTwinModalOpen: mockSetCreateTwinModalOpen,
    });

    render(<DigitalTwinUploader />);
    
    expect(screen.getByText('Digital Twin Name')).toBeInTheDocument();
    expect(screen.getByText('Training Data')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    (useUIStore as any).mockReturnValue({
      isCreateTwinModalOpen: true,
      setCreateTwinModalOpen: mockSetCreateTwinModalOpen,
    });

    mockMutateAsync.mockResolvedValue({ success: true });

    render(<DigitalTwinUploader />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/digital twin name/i), {
      target: { value: 'Test Twin' },
    });

    // Mock file upload
    const fileInput = screen.getByLabelText(/training data/i).parentElement?.querySelector('input[type="file"]');
    if (fileInput) {
      fireEvent.change(fileInput, {
        target: { files: [new File(['test'], 'test.mp4', { type: 'video/mp4' })] },
      });
    }

    // Submit form
    fireEvent.click(screen.getByText('Start Training'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Test Twin',
        description: '',
        training_data_url: expect.stringContaining('test.mp4'),
      });
    });
  });

  it('displays error state correctly', () => {
    (useCreateDigitalTwin as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: { message: 'Upload failed' },
    });

    (useUIStore as any).mockReturnValue({
      isCreateTwinModalOpen: true,
      setCreateTwinModalOpen: mockSetCreateTwinModalOpen,
    });

    render(<DigitalTwinUploader />);
    
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });
});