// src/components/user/Ability.tsx

import { CharacterWithRaw } from "@/app/user/[characterName]/page";
import { useMemo, useState } from "react";
import Tooltip from "@/components/Tooltip";
import formatNumber from "@/lib/formatNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  characterData: CharacterWithRaw;
};

export default function Ability({ characterData }: Props) {
  const initialPreset = Number(characterData.raw_hyper_stat.use_preset_no) - 1;
  const [preset, setPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );
  const currentAbility = [
    characterData.raw_ability.ability_preset_1,
    characterData.raw_ability.ability_preset_2,
    characterData.raw_ability.ability_preset_3,
  ][preset];

  const gradeColor: Record<string, string> = {
    레전드리: "bg-lime-500",
    유니크: "bg-yellow-500",
    에픽: "bg-violet-600",
    레어: "bg-sky-400",
  };

  //console.log(gradeColor[currentAbility.ability_preset_grade]);

  return (
    <div className="w-full flex flex-col gap-1 bg-gray-400 rounded-lg p-4">
      <div className="w-full flex flex-col gap-3 justify-center itmes-center text-white relative">
        <div
          className={`w-full flex justify-start items-center rounded-lg galmuri px-3 py-2 text-sm gap-1 ${
            gradeColor[currentAbility.ability_preset_grade]
          }`}
        >
          <FontAwesomeIcon icon={faBookmark} />
          {currentAbility.ability_preset_grade} 어빌리티
        </div>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((index) => (
            <div
              className={`w-full flex justify-center items-center rounded-lg galmuri px-2 py-1 text-xs gap-1 ${
                gradeColor[currentAbility.ability_info[index].ability_grade]
              }`}
              key={index}
            >
              {currentAbility.ability_info[index].ability_value}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-2xl text-white flex justify-between items-center px-4 py-2 gap-2 mt-2">
        <p className="nexon text-xs">명성치</p>
        <p className="galmuri text-xs text-center">
          {formatNumber(characterData.raw_ability.remain_fame)}
        </p>
      </div>

      <div className="w-full bg-gray-500 rounded-2xl text-white flex justify-center items-center gap-2 py-1">
        <p className="nexon text-xs">PRESETS</p>
        <div
          className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
            preset === 0
              ? "bg-gray-600 border-white"
              : "bg-gray-400 border-gray-500"
          }`}
          onClick={() => setPreset(0)}
        >
          <p className="text-center">1</p>
        </div>
        <div
          className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
            preset === 1
              ? "bg-gray-600 border-white"
              : "bg-gray-400 border-gray-500"
          }`}
          onClick={() => setPreset(1)}
        >
          <p className="text-center">2</p>
        </div>
        <div
          className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
            preset === 2
              ? "bg-gray-600 border-white"
              : "bg-gray-400 border-gray-500"
          }`}
          onClick={() => setPreset(2)}
        >
          <p className="text-center">3</p>
        </div>
      </div>
    </div>
  );
}
