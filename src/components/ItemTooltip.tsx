// src/components/ItemTooltip.tsx

"use client";

import { AndroidPreset, ItemData } from "@/app/user/[characterName]/page";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  item?: ItemData;
  children: React.ReactNode;
}

const STARFORCE_EXCEPTION_PART = [
  "뱃지",
  "엠블렘",
  "포켓 아이템",
  "훈장",
  "보조무기",
  "반지1",
  "반지2",
  "반지3",
  "반지4",
];

const STARFORCE_POSSIBILITY = ["블레이드", "방패"];
const STARFORCE_POSSIBILITY_NAME = [
  "연금술사의 반지",
  "버서커의 임모탈 링",
  "가디언의 임모탈 링",
  "아크로드의 이터널 링",
  "오라클의 이터널 링",
  "버서커의 마이스터 임모탈 링",
  "가디언의 마이스터 임모탈 링",
  "아크로드의 마이스터 이터널 링",
  "오라클의 마이스터 이터널 링",
  "올마이티링",
  "마이스터 올마이티링",
  "무르무르의 메이지 링",
  "무르무르의 로드 링",
  "구미호의 혼령 반지",
  "구미호의 주술 반지",
  "마이스터링",
  "스칼렛 링",
  "실버블라썸 링",
  "고귀한 이피아의 반지",
  "거대한 공포",
  "가디언 엔젤 링",
  "여명의 가디언 엔젤 링",
  "근원의 속삭임",
  "링 오브 페어리퀸",
  "이피아의 반지",
  "플래티넘 크로스 링",
];

const STARTFORCE_MAX_EXCEPTION_SUPERIOR = [
  "헬리시움 정예",
  "노바 히아데스",
  "노바 헤르메스",
  "노바 케이론",
  "노바 리카온",
  "노바 알테어",
  "타일런트 히아데스",
  "타일런트 헤르메스",
  "타일런트 케이론",
  "타일런트 리카온",
  "타일런트 알테어",
];

export default function ItemTooltip({ item, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(true);

  if (!item) return <>{children}</>;

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  const getStarforceMax = (item: ItemData) => {
    const name = item.item_name;
    const level = item.item_base_option.base_equipment_level;

    if (STARTFORCE_MAX_EXCEPTION_SUPERIOR.includes(name)) {
      if (level <= 94) return 3;
      if (level <= 107) return 5;
      if (level <= 117) return 8;
      if (level <= 127) return 10;
      if (level <= 137) return 12;
      return 15;
    }

    if (name.includes("도전자의")) {
      return Number(item.starforce) || 0;
    }

    // 3. 일반 아이템 (레벨별 최대치)
    if (level <= 94) return 5;
    if (level <= 107) return 8;
    if (level <= 117) return 10;
    if (level <= 127) return 15;
    if (level <= 137) return 20;

    return 30;
  };

  const STARFORCE_MAX = getStarforceMax(item);

  const STARFORCE_ROWS = getLayoutStructure(STARFORCE_MAX);

  const showStarforce =
    !STARFORCE_EXCEPTION_PART.includes(item.item_equipment_slot) ||
    STARFORCE_POSSIBILITY.includes(item.item_equipment_part) ||
    STARFORCE_POSSIBILITY_NAME.includes(item.item_name);

  //console.log(item);

  return (
    <>
      <div
        className="w-full h-full flex justify-center items-center cursor-pointer"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {mounted &&
        visible &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none w-[400px] bg-gray-900/95 border border-gray-600 rounded-md p-3 text-xs text-gray-100 shadow-2xl backdrop-blur-sm galmuri"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {showStarforce && (
              <div className="flex flex-col justify-center gap-3 mb-3">
                {STARFORCE_ROWS.map((row, rowIndex) => {
                  const starsInPrevRows = STARFORCE_ROWS.slice(0, rowIndex)
                    .flat()
                    .reduce((a, b) => a + b, 0);

                  return (
                    <div
                      key={rowIndex}
                      className="flex justify-center items-center gap-3"
                    >
                      {row.map((groupCount, groupIndex) => {
                        const starsInPrevGroups = row
                          .slice(0, groupIndex)
                          .reduce((a, b) => a + b, 0);

                        const groupStartIndex =
                          starsInPrevRows + starsInPrevGroups;

                        return (
                          <div key={groupIndex} className="flex">
                            {Array.from(
                              { length: groupCount },
                              (_, itemIndex) => {
                                const currentStarNumber =
                                  groupStartIndex + itemIndex + 1;
                                const starType =
                                  currentStarNumber <= Number(item.starforce)
                                    ? "star"
                                    : "blank";

                                return (
                                  <Starforce key={itemIndex} type={starType} />
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col justify-center items-center">
              <p className="galmuri text-lg">{item.item_name}</p>
              <p className="galmuri text-md text-amber-500">
                {Number(item.cuttable_count) === 255
                  ? "교환 불가"
                  : `교환 불가 (가위 사용 잔여 횟수 : ${item.cuttable_count} / 10)`}
              </p>
            </div>
            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>
            <div className="grid grid-cols-[2fr_8fr]">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex justify-center items-center relative">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_70%)] z-0"></div>
                <img
                  src={item.item_shape_icon}
                  alt={item.item_name || "아이템 툴팁 이미지"}
                  className="relative z-10 object-contain scale-[1.8] [image-rendering:pixelated]"
                />
              </div>

              <div className="w-full flex flex-col justify-start items-end">
                <p className="text-sm text-gray-400 galmuri mb-2">
                  전투력 증가량
                </p>
                <p className="text-2xl font-bold text-gray-400 nexon">
                  현재 장착 중인 장비
                </p>
                <div className="flex gap-1">
                  <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                    장신구
                  </p>
                  <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                    반지
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function getLayoutStructure(total: number) {
  const groups: number[] = [];
  let remaining = total;

  while (remaining > 0) {
    const groupSize = Math.min(remaining, 5);
    groups.push(groupSize);
    remaining -= groupSize;
  }

  const rows: number[][] = [];
  for (let i = 0; i < groups.length; i += 3) {
    rows.push(groups.slice(i, i + +3));
  }

  return rows;
}

function Starforce({ type }: { type: "star" | "blank" }) {
  if (type === "star")
    return (
      <FontAwesomeIcon
        icon={faStar}
        className="text-xs text-amber-300 text-shadow-xl"
      />
    );
  else
    return (
      <FontAwesomeIcon
        icon={faStar}
        className="text-xs text-gray-600 text-shadow-xl"
      />
    );
}

/**
 *
 * 태그 작성
 * 1. 장신구, 방어구, 포켓 아이템, 무기, 보조무기, 엠블렘/파워소스. 안드로이드, 기계 심장, 뱃지, 방어구, 어깨장식, 훈장
 * 2. 한손, 두손
 * 3. 장신구 ( 반지, 벨트, 얼굴장식, 눈장식, 귀고리, 펜던트 ), 무기 ( 두손검, 한손검, ...), 보조무기 ( 로자리오, ...) 엠블렘 ( 엠블렘, 파워소스 ), 방어구 ( 모자, 상의, 하의, ... )
 */
