// src/app/user/[characterName]/_components/CharacterDetails/index.tsx
import Ability from './Ability';
import HyperStat from './HyperStat';
import Propensity from './Propensity';
import StatBox from './StatBox';
import {
  DETAIL_STATS,
  ETC_STATS,
  MAIN_STATS,
  NEXT_ETC_STATS,
} from './contents';
import {
  formatFloat,
  formatNumber,
  formatToKoreanNumber,
} from '@/lib/utils/fotmat';
import { CharacterWithRaw } from '@/types/Character';
import { useMemo } from 'react';

type CharacterDetailsProps = {
  characterData: CharacterWithRaw;
};

export default function CharacterDetails({
  characterData,
}: CharacterDetailsProps) {
  const statsMap = useMemo(() => {
    return characterData.raw_stat.final_stat.reduce(
      (acc, cur) => {
        acc[cur.stat_name] = cur.stat_value;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [characterData.raw_stat.final_stat]);

  const getStat = (key: string, digits = 0) => {
    const val = statsMap?.[key] ?? 0;
    return digits === 0 ? formatNumber(val) : formatFloat(val, digits);
  };

  // 메인 스탯 데이터
  const mainStatsData = MAIN_STATS.map(({ key, subKey }) => ({
    label: key,
    value: `${getStat(key)} (+${getStat(subKey)})`,
  }));

  // 세부 스탯 데이터
  const detailStatsData = [
    {
      label: '스탯 공격력',
      value: formatToKoreanNumber(
        (parseInt(statsMap?.['최소 스탯공격력'] || '0', 10) +
          parseInt(statsMap?.['최대 스탯공격력'] || '0', 10)) /
          2
      ),
    },
    ...DETAIL_STATS.map(({ label, key, unit = '', digits = 2 }) => ({
      label: label,
      value: `${getStat(key, digits)}${unit}`,
    })),
  ];

  // 기타 스탯 데이터
  const etcStatsData = [
    ...ETC_STATS.map(({ label, key, unit = '', digits = 2 }) => ({
      label: label,
      value: `${getStat(key, digits)}${unit}`,
    })),
    ...NEXT_ETC_STATS.map(({ label, key, unit = '' }) => ({
      label: label,
      value: `${getStat(key, 0)}${unit}`,
    })),
  ];

  return (
    <div className="mx-auto md:w-[80%]">
      {/* 전투력 */}
      <div className="relative m-2 flex items-center justify-center rounded-lg bg-sky-800 p-3 text-white">
        <p className="nexon absolute top-1/2 left-5 -translate-y-1/2 font-bold">
          전투력
        </p>
        <p className="nexon text-xl font-bold">
          {formatToKoreanNumber(
            characterData.character_combat_power?.toString()
          ) || 0}
        </p>
      </div>

      {/* 기본 스텟 */}
      <StatBox items={mainStatsData} />
      <StatBox items={detailStatsData} itemsPerPage={17} />
      <StatBox items={etcStatsData} />

      <div className="m-2 mt-5 grid gap-5 md:grid-cols-2">
        {/* 하이퍼 스텟 */}
        <HyperStat characterData={characterData} />

        <div className="flex flex-col gap-5">
          {/* 어빌리티 */}
          <Ability characterData={characterData} />

          {/* 성향 */}
          <Propensity characterData={characterData} />
        </div>
      </div>
    </div>
  );
}
