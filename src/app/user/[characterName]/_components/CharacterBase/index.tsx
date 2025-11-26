// src/app/user/[characterName]/_components/CharacterBase/index.tsx
import CharacterAnimation from './CharacterAnimation';
import CharacterRefresh from './CharacterRefresh';
import { CharacterWithRaw } from '@/types/Character';

type CharacterBaseProps = {
  characterData: CharacterWithRaw;
  onRefresh: () => Promise<void>;
};

export default function CharacterBase({
  characterData,
  onRefresh,
}: CharacterBaseProps) {
  return (
    <div className="flex w-[95%] flex-col items-center lg:w-[80%]">
      <div className="w-full rounded-lg bg-gray-500 bg-[url('/images/common/background.png')] bg-bottom p-3 pt-0 pb-3 lg:py-0">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-[3fr_4fr_3fr] lg:gap-2">
          {/* 중간 데이터 (레벨, 이미지, 이름) */}
          <div className="order-1 col-span-2 flex flex-col items-center lg:order-2 lg:col-span-1">
            {/* 중간 상단 데이터 (레벨) */}
            <div className="galmuri flex w-30 items-center justify-center rounded-b-xl bg-gray-400 text-center text-sm text-white">
              <p className="text-gray-200">Lv.</p>
              <p className="text-xs font-bold">
                {characterData.character_level}
              </p>
            </div>

            {/* 중간 중단 데이터 (이미지) */}
            <div className="relative flex h-64 w-64 flex-col items-center justify-center overflow-hidden rounded-xl p-3">
              <CharacterAnimation baseUrl={characterData.character_image} />
            </div>

            {/* 중간 하단 데이터 (이름) */}
            <div className="galmuri mb-3 flex h-6 w-full items-center justify-center rounded-xl bg-sky-400 text-center text-sm text-white lg:w-40">
              <p>{characterData.character_name}</p>
            </div>
          </div>

          {/* 왼쪽 데이터 (직업, 유니온, 무릉도장, 인기도) */}
          <div className="order-2 col-span-1 flex flex-col justify-start gap-2 pt-0 lg:order-1 lg:items-start lg:justify-between lg:pt-3 lg:pb-3">
            {/* 왼쪽 상단 데이터 (직업) */}
            <div className="galmuri flex h-6 w-full items-center justify-center rounded-xl bg-gray-400 text-center text-sm text-white lg:w-40">
              <p>{characterData.character_class}</p>
            </div>
            {/* 왼쪽 하단 데이터 (유니온, 무릉도장, 인기도) */}
            <div className="flex flex-col gap-1">
              <div className="galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white lg:w-40">
                <p className="text-gray-200">유니온</p>
                <p className="text-xs">{characterData.raw_union.union_level}</p>
              </div>

              <div className="galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white lg:w-40">
                <p className="text-gray-200">무릉도장</p>
                <p className="text-xs">
                  {characterData.raw_dojang.date_dojang_record === null
                    ? '-'
                    : `${characterData.raw_dojang.dojang_best_floor}층`}
                </p>
              </div>

              <div className="galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white lg:w-40">
                <p className="text-gray-200">인기도</p>
                <p className="text-xs">{characterData.character_popularity}</p>
              </div>
            </div>
          </div>

          {/* 오른쪽 데이터 (프로필 변경, 갱신 시간, 길드, 생성일) */}
          <div className="order-3 col-span-1 flex flex-col justify-start gap-2 py-0 lg:items-end lg:justify-between lg:py-3">
            {/* 오른쪽 상단 데이터 (갱신 시간) */}
            <CharacterRefresh
              lastFetchedAt={characterData.lastFetchedAt}
              name={characterData.character_name}
              onRefresh={onRefresh}
            />

            {/* 오른쪽 하단 데이터 (포즈 변경, 길드, 생성일) */}
            <div className="flex flex-col gap-1">
              <div className="galmuri flex h-6 w-full items-center justify-center rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white hover:cursor-pointer hover:bg-gray-700/80 lg:w-40">
                <p className="text-gray-200">프로필 변경</p>
              </div>
              <div
                className={`galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white lg:w-40 ${characterData.character_guild_name ? 'hover:cursor-pointer hover:bg-gray-700/80' : ''}`}
              >
                <p className="text-gray-200">길드</p>
                <p className="text-xs">
                  {characterData.character_guild_name ?? '-'}
                </p>
              </div>
              <div className="galmuri flex h-6 w-full items-center justify-between rounded-xl bg-gray-600/80 px-3 text-center text-sm text-white lg:w-40">
                <p className="whitespace-nowrap text-gray-200">생성일</p>
                <p className="text-xs whitespace-nowrap">
                  {new Date(
                    characterData.character_date_create || ''
                  ).toLocaleDateString('ko-KR') ?? '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
