// src/components/ui/Loader.tsx

'use client';

import { useLoadingStore } from '@/stores/useLoadingStore';
import Image from 'next/image';

export const Loader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center text-center text-white">
        <Image
          src="/images/common/loading.svg"
          width={64}
          height={64}
          alt="Loading Spinner"
        />
        <p className="text-lg font-medium">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
};
