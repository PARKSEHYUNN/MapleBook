// src/components/user/Details.tsx

import { Character } from "@prisma/client";

/**
 * 들어갈 정보
 *
 * 캐릭터 스텟
 *  - 스텟 공격력 (최소 스텟 공격력 ~ 최대 스텟 공격력)
 *  - 데미지
 *  - 보스 몬스터 데미지
 *  - 최종 데미지
 *  - 방어율 무시
 *  - 크리티컬 확률
 *  - 크리티컬 데미지
 *  - 상태이상 내성
 *  - 스탠스
 *  - 방어력
 *  - 이동 속도
 *  - 점프력
 *  - 스타포스
 *  - 아케인 포스
 *  - 어센틱 포스
 *  - STR (AP 배분 STR)
 *  - DEX (AP 배분 DEX)
 *  - INT (AP 배분 INT)
 *  - LUK (AP 배분 LUK)
 *  - HP (AP 배분 HP)
 *  - MP (AP 배분 MP)
 *  - 아이템 드롭률
 *  - 메소 획득량
 *  - 버프 지속시간
 *  - 공격 속도
 *  - 일반 몬스터 데미지
 *  - 재사용 대기시간 감소 (초)
 *  - 재사용 대기시간 감소 (%)
 *  - 재사용 대기시간 미적용
 *  - 속성 내성 무시
 *  - 상태이상 추가 데미지
 *  - 무기 숙련도
 *  - 추가 경험치 획득
 *  - 공격력
 *  - 마력
 *  - 소환수 지속시간 증가
 *
 * 하이퍼 스텟
 *  - 프리셋 1
 *  - 프리셋 2
 *  - 프리셋 3
 *  - 적용된 스탯만 표시 및 레벨 과 적용된 스탯 상세 정보
 * 캐릭터 성향
 * 캐릭터 어빌리티 (모든 프리셋, 적용중인 프리셋 눈에 띄게)
 *  - 프리셋 1
 *  - 프리셋 2
 *  - 프리셋 3
 * 무릉도장
 * 기타 적용 스탯
 *
 */

type Props = {
  characterData: CharacterWithRawStat;
};

type CharacterWithRawStat = Omit<Character, "raw_stat"> & {
  raw_stat: RawStat;
};

type RawStat = {
  character_class: string;
  date: Date | null;
  final_stat: Array<FinalStat>;
};

type FinalStat = {
  stat_name: string;
  stat_value: string;
};

const PERCENT_STATS = new Set([
  "데미지",
  "보스 몬스터 데미지",
  "최종 데미지",
  "방어율 무시",
  "크리티컬 확률",
  "크리티컬 데미지",
  "스탠스",
  "아이템 드롭률",
  "메소 획득량",
  "버프 지속시간",
  "재사용 대기시간 감소 (%)",
  "속성 내성 무시",
  "상태이상 추가 데미지",
  "추가 경험치 획득",
  "소환수 지속시간 증가",
  "일반 몬스터 데미지",
  "재사용 대기시간 미적용",
]);

const BASIC_STAT = new Set(["STR", "DEX", "INT", "LUK", "HP", "MP"]);

const AP_STAT = new Set([
  "AP 배분 STR",
  "AP 배분 DEX",
  "AP 배분 INT",
  "AP 배분 LUK",
  "AP 배분 HP",
  "AP 배분 MP",
]);

const formatNumber = (value: string) => {
  if (isNaN(Number(value))) return value;
  return Number(value).toLocaleString();
};

export default function Details({ characterData }: Props) {
  const getProcessedStats = () => {
    const rawStats = characterData.raw_stat?.final_stat || [];

    return rawStats.reduce((acc, stat) => {
      if (stat.stat_name === "최소 스탯공격력") return acc;
      if (stat.stat_name === "최대 스탯공격력") {
        const minStat = rawStats.find((s) => s.stat_name === "최소 스탯공격력");
        const minVal = minStat ? formatNumber(minStat.stat_value) : "0";
        const maxVal = formatNumber(stat.stat_value);

        acc.push({
          stat_name: "스탯공격력",
          stat_value: `${minVal} ~ ${maxVal}`,
        });

        return acc;
      }

      if (AP_STAT.has(stat.stat_name)) return acc;
      for (const basicStat of BASIC_STAT) {
        if (stat.stat_name === basicStat) {
          const apStat = rawStats.find(
            (s) => s.stat_name === `AP 배분 ${basicStat}`
          );
          const apVal = apStat ? formatNumber(apStat.stat_value) : "0";
          const defaultVal = formatNumber(stat.stat_value);

          acc.push({
            stat_name: stat.stat_name,
            stat_value: `${defaultVal} (+ ${apVal})`,
          });

          return acc;
        }
      }

      if (stat.stat_name === "공격 속도") {
        acc.push({
          stat_name: "공격 속도",
          stat_value: `${stat.stat_value} 단계`,
        });

        return acc;
      }

      let formattedValue = stat.stat_value;

      if (!isNaN(Number(stat.stat_value))) {
        formattedValue = formatNumber(stat.stat_value);
      }

      if (PERCENT_STATS.has(stat.stat_name)) {
        formattedValue += "%";
      }

      acc.push({
        stat_name: stat.stat_name,
        stat_value: formattedValue,
      });

      return acc;
    }, [] as FinalStat[]);
  };

  const processedStats = getProcessedStats();

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {processedStats.map((stat) => (
          <div className="bg-gray-300 rounded-lg p-2" key={stat.stat_name}>
            <p className="text-sm">{stat.stat_name}</p>
            <p className="text-xs ms-1">{stat.stat_value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
