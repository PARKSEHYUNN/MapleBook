// src/app/user/[characterName]/_components/CharacterDetails/Propensity.tsx

'use client';

import PropensityRadar from './PropensityRadar';
import { CharacterWithRaw } from '@/types/Character';

type PropensityProps = {
  characterData: CharacterWithRaw;
};

export default function Propensity({ characterData }: PropensityProps) {
  const propensityData = [
    {
      subject: '카리스마',
      value: characterData.raw_propensity.charisma_level,
      fullMark: 100,
    },
    {
      subject: '감성',
      value: characterData.raw_propensity.sensibility_level,
      fullMark: 100,
    },
    {
      subject: '통찰력',
      value: characterData.raw_propensity.insight_level,
      fullMark: 100,
    },
    {
      subject: '의지',
      value: characterData.raw_propensity.willingness_level,
      fullMark: 100,
    },
    {
      subject: '손재주',
      value: characterData.raw_propensity.handicraft_level,
      fullMark: 100,
    },
    {
      subject: '매력',
      value: characterData.raw_propensity.charm_level,
      fullMark: 100,
    },
  ];

  return (
    <div className="h-fit rounded-lg bg-gray-700/70 p-3">
      <p className="nexon mb-1 font-bold text-lime-400 text-shadow-lg">
        PROPENSITY
      </p>
      <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-400 p-4">
        <div className="itmes-center flex w-full flex-col justify-center gap-3 text-white">
          <PropensityRadar data={propensityData} />
        </div>
        <div className="mt-3 grid w-full grid-cols-2 gap-3 rounded-lg bg-gray-500 p-3">
          {propensityData.map((propensity) => (
            <div
              className="flex items-center justify-between text-white"
              key={propensity.subject}
            >
              <p className="nexon text-sm">{propensity.subject}</p>
              <p className="galmuri text-xs">Lv. {propensity.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
