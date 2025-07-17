import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore');

describe('useAuth Hook', () => {
  const mockSetUser = vi.fn();
  const mockSetProfile = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setLoading: mockSetLoading,
      signOut: mockSignOut,
    });
  });

  it('returns initial auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('correctly identifies user roles', () => {
    (useAuthStore as any).mockReturnValue({
      user: { id: '1' },
      profile: { id: '1', email: 'test@example.com', role: 'company' },
      loading: false,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setLoading: mockSetLoading,
      signOut: mockSignOut,
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isCompany).toBe(true);
    expect(result.current.isAgent).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.hasRole('company')).toBe(true);
    expect(result.current.canAccess(['company', 'admin'])).toBe(true);
  });

  it('handles sign out correctly', async () => {
    const { result } = renderHook(() => useAuth());
    
    await result.current.signOut();
    
    expect(mockSignOut).toHaveBeenCalled();
  });
});