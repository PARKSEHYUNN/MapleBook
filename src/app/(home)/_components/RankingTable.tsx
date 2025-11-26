// src/app/(home)/_components/RankingTable.tsx
import { formatToKoreanNumber } from '@/lib/utils/fotmat';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faCrown } from '@fortawesome/free-solid-svg-icons/faCrown';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons/faRankingStar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type RankingTableProps = {
  type: '전투력' | '검색';
  rankingDatas: RankingData[];
};

type RankingData = {
  rank: number;
  image: string;
  name: string;
  level: number;
  class: string;
  combatPower?: string;
  searchCount?: number;
};

export default function RankingTable({
  type,
  rankingDatas,
}: RankingTableProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 랭킹 헤더 */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            <FontAwesomeIcon icon={faRankingStar} /> {type} 랭킹
          </h3>
          {type === '검색' && (
            <span className="ms-2 text-sm text-gray-500">최근 7일</span>
          )}
        </div>
        <span className="text-xs text-gray-500">Top 5</span>
      </div>

      {/* 랭킹 리스트 컨테이너 */}
      <div className="flex flex-col gap-2">
        {rankingDatas.map((data) => {
          const isTop3 = data.rank <= 3;
          const rankColors = [
            'text-yellow-500',
            'text-gray-400',
            'text-amber-700',
          ];

          return (
            <div
              key={data.rank}
              className={`relative flex items-center justify-between rounded-xl p-4 transition-all hover:cursor-pointer hover:shadow-md ${isTop3 ? 'border border-orange-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800' : 'border border-transparent bg-gray-50 dark:bg-gray-800/50'}`}
              onClick={() => router.push(`/user/${data.name}`)}
            >
              {/* 왼쪽: 랭킹 + 정보 */}
              <div className="flex items-center gap-4">
                {/* 랭킹 숫자/아이콘 */}
                <div className="flex w-8 flex-col items-center justify-center font-bold">
                  {isTop3 ? (
                    <FontAwesomeIcon
                      icon={faCrown}
                      className={`text-xl ${rankColors[data.rank - 1]} drop-shadow-sm`}
                    />
                  ) : (
                    <span className="text-lg text-gray-500 italic dark:text-gray-400">
                      {data.rank}
                    </span>
                  )}
                </div>

                {/* 캐릭터 정보 */}
                <div className="flex items-center gap-3">
                  {/* 캐릭터 이미지 */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-400 ${isTop3 ? 'ring-2 ring-orange-200 dark:ring-gray-600' : ''}`}
                  >
                    {/* <FontAwesomeIcon icon={faUser} className="text-sm" /> */}
                    <Image
                      src={data.image}
                      width={32}
                      height={32}
                      alt="Ranking Character Image"
                      className="translate-x-0.5 translate-y-0 scale-[5.5] rounded-full bg-white"
                      unoptimized={true}
                    />
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {data.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-700">
                        Lv. {data.level}
                      </span>
                      <span>{data.class}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 핵심 수치 (전투력 / 검색 횟수) */}
              <div className="text-right">
                <span
                  className={`block font-bold whitespace-nowrap ${type === '전투력' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}
                >
                  {type === '전투력'
                    ? formatToKoreanNumber(data.combatPower)
                    : `${formatToKoreanNumber(data.searchCount)}회`}
                </span>
                <span className="hidden text-[10px] text-gray-400 sm:block">
                  {type}
                </span>
              </div>
            </div>
          );
        })}

        {/* 랭킹 더보기 */}
        <Link
          href={type === '전투력' ? '/rank#combat' : '/rank#search'}
          className="relative flex items-center justify-center rounded-xl border border-transparent bg-gray-50 p-2 transition-all hover:cursor-pointer hover:shadow-md dark:bg-gray-800/50"
        >
          <span className="text-sm">{type} 랭킹 더보기</span>
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            <FontAwesomeIcon icon={faAngleRight} />
          </span>
        </Link>
      </div>
    </div>
  );
}
