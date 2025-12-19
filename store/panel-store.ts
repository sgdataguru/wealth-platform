/**
 * @file panel-store.ts
 * @description Zustand store for Prospect Detail Panel state management
 * @module store/panel-store
 */

import { create } from 'zustand';

interface PanelState {
  // State
  selectedProspectId: string | null;
  isPanelOpen: boolean;
  isLoading: boolean;
  
  // Actions
  openPanel: (prospectId: string) => void;
  closePanel: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Panel store using Zustand
 * Manages the open/close state of the Prospect Detail Panel
 */
export const usePanelStore = create<PanelState>((set) => ({
  // Initial state
  selectedProspectId: null,
  isPanelOpen: false,
  isLoading: false,
  
  // Actions
  openPanel: (prospectId: string) => {
    set({
      selectedProspectId: prospectId,
      isPanelOpen: true,
      isLoading: true,
    });
  },
  
  closePanel: () => {
    set({
      isPanelOpen: false,
      isLoading: false,
    });
    
    // Delay clearing prospect ID to allow exit animation
    setTimeout(() => {
      set({ selectedProspectId: null });
    }, 300);
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
