// src/app/page.tsx

'use client';

import RankingTable from './_components/RankingTable';
import SearchWithHistory from './_components/SearchWithHistory';
import Separator from '@/components/ui/Separator';
import Image from 'next/image';

export default function HomePage() {
  const rankTempData = [
    {
      rank: 1,
      name: '리코다요',
      level: 272,
      class: '렌',
      combatPower: '1952535907',
      searchCount: 294705,
      image:
        'https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHMOBKINFMNFJDGJFLBEBGEAOBPDNAGINKFMIBAAGKPCHEJGDFEPNENCGMCNGCHJBMGMCBNLDMAJFOFEBGBNCOFJLJFLHNJEAANBJEOMHBMJKJNEMLEOMDBNFOIFJILPEPFBKCJOGOKJONCAMAPIBHAPJNELDFCDPGPFAFPPCMMJIAHDHHAIPANABLBEAKFHEKOLJPJFDOEPEBNJFKMFJFNPFNOBBHGFKH?wmotion=W00',
    },
    {
      rank: 2,
      name: '리코다요',
      level: 272,
      class: '렌',
      combatPower: '195253903',
      searchCount: 29470,
      image:
        'https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHMOBKINFMNFJDGJFLBEBGEAOBPDNAGINKFMIBAAGKPCHEJGDFEPNENCGMCNGCHJBMGMCBNLDMAJFOFEBGBNCOFJLJFLHNJEAANBJEOMHBMJKJNEMLEOMDBNFOIFJILPEPFBKCJOGOKJONCAMAPIBHAPJNELDFCDPGPFAFPPCMMJIAHDHHAIPANABLBEAKFHEKOLJPJFDOEPEBNJFKMFJFNPFNOBBHGFKH?wmotion=W00',
    },
    {
      rank: 3,
      name: '리코다요',
      level: 272,
      class: '렌',
      combatPower: '19525350',
      searchCount: 2947,
      image:
        'https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHMOBKINFMNFJDGJFLBEBGEAOBPDNAGINKFMIBAAGKPCHEJGDFEPNENCGMCNGCHJBMGMCBNLDMAJFOFEBGBNCOFJLJFLHNJEAANBJEOMHBMJKJNEMLEOMDBNFOIFJILPEPFBKCJOGOKJONCAMAPIBHAPJNELDFCDPGPFAFPPCMMJIAHDHHAIPANABLBEAKFHEKOLJPJFDOEPEBNJFKMFJFNPFNOBBHGFKH?wmotion=W00',
    },
    {
      rank: 4,
      name: '리코다요',
      level: 272,
      class: '렌',
      combatPower: '9525359',
      searchCount: 294,
      image:
        'https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHMOBKINFMNFJDGJFLBEBGEAOBPDNAGINKFMIBAAGKPCHEJGDFEPNENCGMCNGCHJBMGMCBNLDMAJFOFEBGBNCOFJLJFLHNJEAANBJEOMHBMJKJNEMLEOMDBNFOIFJILPEPFBKCJOGOKJONCAMAPIBHAPJNELDFCDPGPFAFPPCMMJIAHDHHAIPANABLBEAKFHEKOLJPJFDOEPEBNJFKMFJFNPFNOBBHGFKH?wmotion=W00',
    },
    {
      rank: 5,
      name: '리코다요',
      level: 272,
      class: '렌',
      combatPower: '952535',
      searchCount: 29,
      image:
        'https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHMOBKINFMNFJDGJFLBEBGEAOBPDNAGINKFMIBAAGKPCHEJGDFEPNENCGMCNGCHJBMGMCBNLDMAJFOFEBGBNCOFJLJFLHNJEAANBJEOMHBMJKJNEMLEOMDBNFOIFJILPEPFBKCJOGOKJONCAMAPIBHAPJNELDFCDPGPFAFPPCMMJIAHDHHAIPANABLBEAKFHEKOLJPJFDOEPEBNJFKMFJFNPFNOBBHGFKH?wmotion=W00',
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      <h1 className="mb-3 flex flex-row items-center gap-2 text-4xl font-bold dark:text-gray-50">
        <Image
          src="/images/common/logo.svg"
          width={64}
          height={64}
          alt="Main Logo"
        />
        MapleBook
      </h1>

      {/* 캐릭터 검색 */}
      <SearchWithHistory />

      <Separator className="w-[70%] border-gray-300" />

      {/* 캐릭터 순위 */}
      <div className="grid w-[70%] grid-cols-1 gap-5 md:grid-cols-2">
        {/* 전투력 순위 */}
        <RankingTable type="전투력" rankingDatas={rankTempData} />

        {/* 검색 순위 */}
        <RankingTable type="검색" rankingDatas={rankTempData} />
      </div>
    </div>
  );
}
