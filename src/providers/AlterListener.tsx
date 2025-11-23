// src/providers/AlertListener.tsx

'use client';

import { useAlertStore } from '@/stores/useAlertStore';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const AlertListener = () => {
  const { isOpen, message, type, closeAlert } = useAlertStore();

  useEffect(() => {
    if (isOpen) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: type,
        title: message,
      }).then(() => {
        closeAlert();
      });
    }
  }, [isOpen, message, type, closeAlert]);

  return null;
};

export default AlertListener;
