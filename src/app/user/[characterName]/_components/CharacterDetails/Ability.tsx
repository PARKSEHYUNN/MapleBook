// src/app/user/[characterName]/_components/CharacterDetails/Ability.tsx
import PresetNavigation from '@/components/common/PresetNavigation';
import { formatNumber } from '@/lib/utils/fotmat';
import { CharacterWithRaw } from '@/types/Character';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

type AbilityProps = {
  characterData: CharacterWithRaw;
};

export default function Ability({ characterData }: AbilityProps) {
  const initialPreset = Number(characterData.raw_ability.preset_no) - 1;
  const [currentPreset, setCurrentPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );

  const currentData = [
    characterData.raw_ability.ability_preset_1,
    characterData.raw_ability.ability_preset_2,
    characterData.raw_ability.ability_preset_3,
  ][currentPreset];

  const gradeColor: Record<string, string> = {
    레전드리: 'bg-lime-500',
    유니크: 'bg-yellow-500',
    에픽: 'bg-violet-600',
    레어: 'bg-sky-400',
  };

  return (
    <div className="h-fit rounded-lg bg-gray-700/70 p-3">
      <p className="nexon mb-1 font-bold text-lime-400 text-shadow-lg">
        ABILITY
      </p>
      <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-400 p-4">
        <div className="itmes-center flex w-full flex-col justify-center gap-3 text-white">
          <div
            className={`galmuri flex w-full items-center justify-start gap-1 rounded-lg px-3 py-2 text-sm ${
              gradeColor[currentData.ability_preset_grade]
            }`}
          >
            <FontAwesomeIcon icon={faBookmark} />
            {currentData.ability_preset_grade} 어빌리티
          </div>
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((index) => (
              <div
                className={`galmuri flex w-full items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs ${
                  gradeColor[currentData.ability_info[index].ability_grade]
                }`}
                key={index}
              >
                {currentData.ability_info[index].ability_value}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex w-full items-center justify-between gap-2 rounded-2xl bg-gray-700 px-4 py-2 text-white">
          <p className="nexon text-xs">명성치</p>
          <p className="galmuri text-center text-xs">
            {formatNumber(characterData.raw_ability.remain_fame)}
          </p>
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
