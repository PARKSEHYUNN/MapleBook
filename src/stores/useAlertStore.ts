// src/stores/useAlertStore.ts
import { create } from 'zustand';

type AlertStore = {
  message: string;
  type: 'success' | 'error' | 'info';
  isOpen: boolean;
  openAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
  closeAlert: () => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  message: '',
  type: 'error',
  isOpen: false,
  openAlert: (message, type = 'error') => set({ isOpen: true, message, type }),
  closeAlert: () => set({ isOpen: false }),
}));
