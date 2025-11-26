// src/app/user/[characterName]/_components/CharacterDetails/HyperStat.tsx
import { HYPER_STATS } from './contents';
import PresetNavigation from '@/components/common/PresetNavigation';
import { CharacterWithRaw } from '@/types/Character';
import { useMemo, useState } from 'react';

type HyperStatProps = {
  characterData: CharacterWithRaw;
};

type HyperMap = {
  stat_type: string;
  stat_increase: string;
  stat_level: number;
  stat_point: number;
};

export default function HyperStat({ characterData }: HyperStatProps) {
  const initialPreset = Number(characterData.raw_hyper_stat.use_preset_no) - 1;
  const [currentPreset, setCurrentPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );
  const hyperPreset = useMemo(() => {
    if (!characterData.raw_hyper_stat) {
      return [];
    }

    const raw = characterData.raw_hyper_stat;

    const processPreset = (presetData: HyperMap[]) => {
      return presetData.reduce(
        (acc, cur) => {
          acc[cur.stat_type] = cur;

          return acc;
        },
        {} as Record<string, HyperMap>
      );
    };

    return [
      processPreset(raw.hyper_stat_preset_1),
      processPreset(raw.hyper_stat_preset_2),
      processPreset(raw.hyper_stat_preset_3),
    ];
  }, [characterData.raw_hyper_stat]);

  const currentData = hyperPreset[currentPreset];
  const currentPoint = [
    characterData.raw_hyper_stat.hyper_stat_preset_1_remain_point,
    characterData.raw_hyper_stat.hyper_stat_preset_2_remain_point,
    characterData.raw_hyper_stat.hyper_stat_preset_3_remain_point,
  ][currentPreset];

  return (
    <div className="h-fit rounded-lg bg-gray-700/70 p-3">
      <p className="nexon mb-1 font-bold text-lime-400 text-shadow-lg">
        HYPER STAT
      </p>
      <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-400 p-4">
        <div className="itmes-center flex w-full flex-col justify-center gap-3 text-white">
          {HYPER_STATS.map((stat) => {
            const data = currentData[stat.key];
            const level = data?.stat_level || 0;

            return (
              <div
                className="flex w-full items-center justify-between"
                key={stat.key}
              >
                <p className="nexon text-sm font-bold text-shadow-lg">
                  {stat.label}
                </p>
                <div className="flex w-8 justify-between gap-1">
                  <p className="galmuri text-xs text-shadow-lg">Lv.</p>
                  <p className="galmuri text-xs text-shadow-lg">{level}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2 rounded-2xl bg-gray-700 px-4 py-2 text-white">
          <p className="nexon text-xs">POINT</p>
          <p className="galmuri text-center text-xs">{currentPoint}</p>
        </div>

        <PresetNavigation
          presets={[1, 2, 3]}
          initalIndex={initialPreset}
          activeIndex={currentPreset}
          onSelect={setCurrentPreset}
        />
      </div>
    </div>
  );
}
