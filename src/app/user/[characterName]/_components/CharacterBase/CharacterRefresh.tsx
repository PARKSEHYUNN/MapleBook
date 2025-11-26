// src/app/user/[characterName]/_components/CharacterBase/CharacterRefresh.tsx

'use client';

import { formatTimeAgo } from '@/lib/utils/fotmat';
import { useAlertStore } from '@/stores/useAlertStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CharacterRefreshProps = {
  lastFetchedAt: string | Date | undefined;
  name: string | undefined;
  onRefresh: () => Promise<void>;
};

export default function CharacterRefresh({
  lastFetchedAt,
  name,
  onRefresh,
}: CharacterRefreshProps) {
  const [refreshText, setRefreshText] = useState('로딩 중...');
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  const router = useRouter();

  const handleRefresh = async () => {
    if (isRefreshLoading || name === undefined) {
      return null;
    }

    try {
      setIsRefreshLoading(true);

      const res = await fetch(`/api/character/refresh?name=${name}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => {});
        throw new Error(errorData.message || '갱신 요청 실패');
      }

      await onRefresh();
      router.refresh();
    } catch (error) {
      useAlertStore
        .getState()
        .openAlert(
          error instanceof Error
            ? error.message
            : '데이터를 새로고침 하는 중 오류가 발생했습니다.'
        );
    } finally {
      setIsRefreshLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (lastFetchedAt) {
      setRefreshText(formatTimeAgo(lastFetchedAt));

      timer = setInterval(() => {
        setRefreshText(formatTimeAgo(lastFetchedAt));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [lastFetchedAt]);

  return (
    <div
      className="galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-400 px-3 text-center text-sm text-white hover:cursor-pointer hover:bg-gray-500 lg:w-40"
      onClick={handleRefresh}
    >
      <p className="text-gray-200">갱신시간</p>
      <p className="text-xs">
        {isRefreshLoading && (
          <Image
            src="/images/common/loading.svg"
            width={12}
            height={12}
            alt="Loading Spinner"
          />
        )}
        {!isRefreshLoading && refreshText}
      </p>
    </div>
  );
}
