import { create } from 'zustand';

interface UIState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Modals
  isCreateTwinModalOpen: boolean;
  isCreateCampaignModalOpen: boolean;
  setCreateTwinModalOpen: (open: boolean) => void;
  setCreateCampaignModalOpen: (open: boolean) => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Loading states
  isUploading: boolean;
  setUploading: (uploading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Theme
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // Modals
  isCreateTwinModalOpen: false,
  isCreateCampaignModalOpen: false,
  setCreateTwinModalOpen: (open) => set({ isCreateTwinModalOpen: open }),
  setCreateCampaignModalOpen: (open) => set({ isCreateCampaignModalOpen: open }),
  
  // Sidebar
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  // Loading states
  isUploading: false,
  setUploading: (uploading) => set({ isUploading: uploading }),
}));