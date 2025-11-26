// src/app/user/[characterName]/page.tsx

'use client';

import CharacterBase from './_components/CharacterBase';
import CharacterDetails from './_components/CharacterDetails';
import { TabNavigation } from '@/components/common/TabNavigation';
import { useTab } from '@/hooks/useTab';
import { useAlertStore } from '@/stores/useAlertStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { CharacterWithRaw } from '@/types/Character';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

// 탭 목록
const TABS = [
  { id: 'board', label: '방명록' },
  { id: 'details', label: '상세 정보' },
  { id: 'equip', label: '장착 아이템' },
  { id: 'skill', label: '스킬' },
];

type CharacterPageProps = {
  params: Promise<{ characterName: string }>;
};

export default function CharacterPage({ params }: CharacterPageProps) {
  const { characterName: urlCharacterName } = use(params);
  const characterName = decodeURI(urlCharacterName);

  const [characterData, setCharacterData] = useState<CharacterWithRaw | null>(
    null
  );

  const router = useRouter();

  const fetchData = async () => {
    useLoadingStore.getState().showLoading();

    try {
      const res = await fetch(`/api/character?name=${characterName}`);
      const result = await res.json();

      if (!res.ok) {
        useAlertStore.getState().openAlert(result.message);
        return router.push('/');
      }

      setCharacterData(result.data);
    } catch (error) {
      useAlertStore
        .getState()
        .openAlert(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생 했습니다.'
        );
      return router.push('/');
    } finally {
      useLoadingStore.getState().hideLoading();
    }
  };

  // 캐릭터 정보 불러오기
  useEffect(() => {
    fetchData();
  }, [characterName]);

  // 탭 관리
  const { activeTab } = useTab(TABS, 'board');

  if (!characterData) {
    return null;
  }

  // 탭 컨텐츠 관리
  const tabContents = {
    board: <></>,
    details: <CharacterDetails characterData={characterData} />,
    equip: <></>,
    skill: <></>,
  };

  console.log(characterData);

  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      <CharacterBase characterData={characterData} onRefresh={fetchData} />
      <TabNavigation tabs={TABS} activeTab={activeTab} />

      <div className="min-h-[1000px] w-full rounded-b-xl bg-gray-700/70">
        {characterData && tabContents[activeTab]}
      </div>
    </div>
  );
}
