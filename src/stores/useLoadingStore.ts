// src/stores/useLoadingStore.ts
import { create } from 'zustand';

type LoadingState = {
  isLoading: boolean;
  count: number;
  showLoading: () => void;
  hideLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  count: 0,
  showLoading: () =>
    set((state) => {
      const newCount = state.count + 1;
      return { count: newCount, isLoading: true };
    }),
  hideLoading: () =>
    set((state) => {
      const newCount = Math.max(0, state.count - 1);
      return { count: newCount, isLoading: newCount > 0 };
    }),
}));
