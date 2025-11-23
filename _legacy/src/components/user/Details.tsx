// src/components/user/Details.tsx

import { CharacterWithRaw } from "@/app/user/[characterName]/page";
import formatFloat from "@/lib/formatFloat";
import formatNumber from "@/lib/formatNumber";
import formatToKoreanNumber from "@/lib/formatToKoreanNumber";
import getAvg from "@/lib/getAvg";
import Tooltip from "@/components/Tooltip";
import {
  faArrowUp,
  faCircle,
  faCircleArrowUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Character } from "@prisma/client";
import { useMemo, useRef, useState } from "react";
import HyperStat from "./HyperStat";
import Ability from "./Ability";

type Props = {
  characterData: CharacterWithRaw;
};

export default function Details({ characterData }: Props) {
  const [page, setPage] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (timerRef.current) return;

    setPage((prevPage) => (prevPage === 0 ? 1 : 0));

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
    }, 500);
  };

  const statsMap = useMemo(() => {
    return characterData.raw_stat.final_stat.reduce((acc, cur) => {
      acc[cur.stat_name] = cur.stat_value;
      return acc;
    }, {} as Record<string, string>);
  }, [characterData.raw_stat.final_stat]);

  return (
    <div>
      <div className="w-[80%] mx-auto">
        <div className="w-full m-2 p-3 flex justify-center itmes-center bg-sky-800 text-white rounded-lg relative">
          <p className="nexon font-bold absolute left-5 top-1/2 -translate-y-1/2">
            전투력
          </p>
          <p className="text-xl nexon font-bold">
            {formatToKoreanNumber(
              characterData.character_combat_power?.toString() || 0
            )}
          </p>
        </div>

        <div className="w-full m-2 p-4 grid grid-cols-2 gap-5 justify-center itmes-center bg-gray-400 text-white rounded-lg relative">
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">HP</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["HP"])} (+{" "}
              {formatNumber(statsMap["AP 배분 HP"])})
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">MP</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["MP"])} (+{" "}
              {formatNumber(statsMap["AP 배분 MP"])})
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">STR</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["STR"])} (+{" "}
              {formatNumber(statsMap["AP 배분 STR"])})
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">DEX</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["DEX"])} (+{" "}
              {formatNumber(statsMap["AP 배분 DEX"])})
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">INT</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["INT"])} (+{" "}
              {formatNumber(statsMap["AP 배분 INT"])})
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">LUK</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["LUK"])} (+{" "}
              {formatNumber(statsMap["AP 배분 LUK"])})
            </p>
          </div>
        </div>

        <div className="w-full m-2 p-4 grid grid-cols-2 gap-5 justify-center itmes-center bg-gray-500 text-white rounded-lg relative">
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              스탯 공격력
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatToKoreanNumber(
                getAvg(statsMap["최소 스탯공격력"], statsMap["최대 스탯공격력"])
              )}
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">데미지</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["데미지"], 2)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              최종 데미지
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["최종 데미지"], 2)}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              보스 몬스터 데미지
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["보스 몬스터 데미지"], 2)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              방어율 무시
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["방어율 무시"], 2)}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              일반 몬스터 데미지
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["일반 몬스터 데미지"], 2)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">공격력</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["공격력"])}
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              크리티컬 확률
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["크리티컬 확률"], 0)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">마력</p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["마력"])}
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              크리티컬 데미지
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["크리티컬 데미지"], 2)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              재사용 대기시간 감소
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatNumber(statsMap["재사용 대기시간 감소 (초)"])}초 /{" "}
              {formatNumber(statsMap["재사용 대기시간 감소 (%)"])}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              버프 지속시간
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["버프 지속시간"], 0)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              재사용 대기시간 미적용
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["재사용 대기시간 미적용"], 2)}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              속성 내성 무시
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["속성 내성 무시"], 2)}%
            </p>
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              상태이상 추가 데미지
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["상태이상 추가 데미지"], 2)}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              소환수 지속시간 증가
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["소환수 지속시간 증가"], 0)}%
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="nexon font-bold text-sm text-shadow-lg">
              무기 숙련도
            </p>
            <p className="galmuri text-xs text-shadow-lg">
              {formatFloat(statsMap["무기 숙련도"], 0)}%
            </p>
          </div>
        </div>

        <div
          className="w-full m-2 p-4 bg-gray-500 text-white rounded-lg relative"
          onWheel={handleWheel}
        >
          {page === 0 && (
            <div className="grid grid-cols-2 gap-5 justify-center itmes-center">
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  메소 획득량
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["메소 획득량"], 0)}%
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  스타포스
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["스타포스"])}
                </p>
              </div>

              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  아이템 드롭률
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["아이템 드롭률"], 0)}%
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  아케인포스
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["아케인포스"])}
                </p>
              </div>

              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  추가 경험치 획득
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["추가 경험치 획득"], 2)}%
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  어센틱포스
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["어센틱포스"])}
                </p>
              </div>
            </div>
          )}
          {page === 1 && (
            <div className="grid grid-cols-2 gap-5 justify-center itmes-center">
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">방어력</p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["방어력"])}
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  상태이상 내성
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["상태이상 내성"])}
                </p>
              </div>

              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  이동속도
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["이동속도"], 0)}%
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">점프력</p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["점프력"], 0)}%
                </p>
              </div>

              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">스탠스</p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatFloat(statsMap["스탠스"], 0)}%
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p className="nexon font-bold text-sm text-shadow-lg">
                  공격 속도
                </p>
                <p className="galmuri text-xs text-shadow-lg">
                  {formatNumber(statsMap["공격 속도"])}단계
                </p>
              </div>
            </div>
          )}

          <div className="w-full flex justify-center mt-2 gap-2">
            <div
              className={`text-[7px] hover:cursor-pointer ${
                page === 0 ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setPage(0)}
            >
              <FontAwesomeIcon icon={faCircle} />
            </div>
            <div
              className={`text-[7px] hover:cursor-pointer ${
                page === 1 ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setPage(1)}
            >
              <FontAwesomeIcon icon={faCircle} />
            </div>
          </div>
        </div>

        <div className="w-full m-2 grid md:grid-cols-2 gap-5">
          <HyperStat characterData={characterData} />
          <Ability characterData={characterData} />
        </div>
      </div>
    </div>
  );
}
