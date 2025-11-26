// src/lib/alert.ts
import { useAlertStore } from '@/stores/useAlertStore';

export const alert = (
  message: string,
  type: 'success' | 'error' | 'info' = 'error'
) => {
  useAlertStore.getState().openAlert(message, type);
};

export const successAlert = (message: string) => alert(message, 'success');
export const errorAlert = (message: string) => alert(message, 'error');
export const infoAlert = (message: string) => alert(message, 'info');
