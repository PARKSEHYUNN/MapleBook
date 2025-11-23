// src/components/user/HyperStat.tsx

import { CharacterWithRaw } from "@/app/user/[characterName]/page";
import { useMemo, useState } from "react";
import Tooltip from "@/components/Tooltip";

type Props = {
  characterData: CharacterWithRaw;
};

type HyperMap = {
  stat_increase: string;
  stat_level: number;
  stat_point: number;
};

const HYPER_STAT_LIST = [
  { key: "STR", label: "STR" },
  { key: "DEX", label: "DEX" },
  { key: "INT", label: "INT" },
  { key: "LUK", label: "LUK" },
  { key: "HP", label: "HP" },
  { key: "MP", label: "MP" },
  { key: "DF/TF/PP", label: "DF/TF/PP" },
  { key: "크리티컬 확률", label: "크리티컬 확률" },
  { key: "크리티컬 데미지", label: "크리 데미지" },
  { key: "방어율 무시", label: "방어율 무시" },
  { key: "데미지", label: "데미지" },
  { key: "보스 몬스터 공격 시 데미지 증가", label: "보스 데미지" },
  { key: "일반 몬스터 공격 시 데미지", label: "일반 데미지" },
  { key: "상태 이상 내성", label: "상태 이상 내성" },
  { key: "공격력/마력", label: "공격력 / 마력" },
  { key: "획득 경험치", label: "획득 경험치" },
  { key: "아케인포스", label: "아케인포스" },
];

export default function HyperStat({ characterData }: Props) {
  const initialPreset = Number(characterData.raw_hyper_stat.use_preset_no) - 1;
  const [preset, setPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );

  const hyperMap1 = useMemo(() => {
    return characterData.raw_hyper_stat.hyper_stat_preset_1.reduce(
      (acc, cur) => {
        acc[cur.stat_type] = {
          stat_increase: cur.stat_increase,
          stat_level: cur.stat_level,
          stat_point: cur.stat_point,
        };
        return acc;
      },
      {} as Record<string, HyperMap>
    );
  }, [characterData.raw_hyper_stat.hyper_stat_preset_1]);

  const hyperMap2 = useMemo(() => {
    return characterData.raw_hyper_stat.hyper_stat_preset_2.reduce(
      (acc, cur) => {
        acc[cur.stat_type] = {
          stat_increase: cur.stat_increase,
          stat_level: cur.stat_level,
          stat_point: cur.stat_point,
        };
        return acc;
      },
      {} as Record<string, HyperMap>
    );
  }, [characterData.raw_hyper_stat.hyper_stat_preset_2]);

  const hyperMap3 = useMemo(() => {
    return characterData.raw_hyper_stat.hyper_stat_preset_3.reduce(
      (acc, cur) => {
        acc[cur.stat_type] = {
          stat_increase: cur.stat_increase,
          stat_level: cur.stat_level,
          stat_point: cur.stat_point,
        };
        return acc;
      },
      {} as Record<string, HyperMap>
    );
  }, [characterData.raw_hyper_stat.hyper_stat_preset_3]);

  const currentStatsMap = [hyperMap1, hyperMap2, hyperMap3][preset];
  const currentStatsPoint = [
    characterData.raw_hyper_stat.hyper_stat_preset_1_remain_point,
    characterData.raw_hyper_stat.hyper_stat_preset_2_remain_point,
    characterData.raw_hyper_stat.hyper_stat_preset_3_remain_point,
  ][preset];

  return (
    <div className="w-full flex flex-col gap-1 bg-gray-400 rounded-lg p-4">
      <div className="w-full flex flex-col gap-3 justify-center itmes-center text-white relative">
        {HYPER_STAT_LIST.map((stat) => {
          const data = currentStatsMap[stat.key];
          const level = data?.stat_level || 0;

          if (level === 0) return null;

          const tooltipContent = data?.stat_increase || "정보 없음";

          return (
            <Tooltip
              content={tooltipContent}
              side="bottom"
              delayDuration={0}
              key={stat.key}
            >
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  {stat.label}
                </p>
                <div className="flex justify-between gap-1 w-8">
                  <p className="galmuri text-xs text-shadow-lg">Lv.</p>
                  <p className="galmuri text-xs text-shadow-lg">{level}</p>
                </div>
              </div>
            </Tooltip>
          );
        })}

        {Object.values(currentStatsMap).every((v) => v.stat_level === 0) && (
          <p className="text-white nexon text-shadow-lg">
            투자한 스탯이 없습니다.
          </p>
        )}
      </div>

      <div className="w-full bg-gray-700 rounded-2xl text-white flex justify-between items-center px-4 py-2 gap-2 mt-2">
        <p className="nexon text-xs">POINT</p>
        <p className="galmuri text-xs text-center">{currentStatsPoint}</p>
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
