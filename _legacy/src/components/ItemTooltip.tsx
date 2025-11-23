// src/components/ItemTooltip.tsx

"use client";

import {
  AndroidPreset,
  ItemData,
  ItemTotalOption,
} from "@/app/user/[characterName]/page";
import {
  faComputerMouse,
  faFire,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { includes } from "zod";

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

const STARFORCE_POSSIBILITY = ["블레이드", "방패", "대검", "태도"];
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

const ITEM_TAG = {
  장신구: [
    "반지1",
    "반지2",
    "반지3",
    "반지4",
    "벨트",
    "얼굴장식",
    "눈장식",
    "귀고리",
    "펜던트",
    "펜던트2",
  ],
  무기: ["무기"],
  보조무기: ["보조무기"],
  "엠블렘/파워소스": ["엠블렘"],
  방어구: ["모자", "상의", "하의", "망토", "신발", "장갑"],
  "포켓 아이템": ["포켓 아이템"],
  안드로이드: ["안드로이드"],
  "기계 심장": ["기계 심장"],
  어깨장식: ["어깨장식"],
  훈장: ["훈장"],
  뱃지: ["뱃지"],
};

const WEAPON_HAND = {
  한손: [
    "한손검",
    "한손도끼",
    "한손둔기",
    "데스페라도",
    "튜너",
    "장검",
    "스태프",
    "완드",
    "샤이닝로드",
    "ESP리미터",
    "매직건틀렛",
    "메모리얼스태프",
    "브레스슈터",
    "단검",
    "케인",
    "체인",
    "부채",
    "소울슈터",
    "에너지소드",
  ],
  두손: [
    "두손검",
    "두손도끼",
    "두손둔기",
    "창",
    "폴암",
    "태도",
    "대검",
    "건틀렛리볼버",
    "카타나",
    "활",
    "석궁",
    "듀얼보우건",
    "에이션트보우",
    "아대",
    "차크람",
    "너클",
    "건",
    "핸드캐논",
    "무권",
  ],
};

const SET_EFFECT_LIST = {
  "루타비스 세트(전사)": {
    include: false,
    items: [
      "하이네스 워리어헬름",
      "이글아이 워리어아머",
      "트릭스터 워리어팬츠",
      "파프니르 미스틸테인",
      "파프니르 트윈클리버",
      "파프니르 골디언해머",
      "파프니르 페니텐시아",
      "파프니르 배틀클리버",
      "파프니르 라이트닝어",
      "파프니르 브류나크",
      "파프니르 문글레이브",
      "파프니르 데스브링어",
      "파프니르 빅 마운틴",
      "파프니르 포기브니스",
      "파프니르 용천검",
      "",
    ],
  },

  "이피아의 보물 세트": {
    include: false,
    items: ["이피아의 반지", "이피아의 귀고리", "이피아의 목걸이"],
  },
  "마이스터 세트": {
    include: true,
    items: ["마이스터 이어링", "마이스터링", "마이스터 숄더", "마이스터"],
  },
  "칠요 세트": {
    include: false,
    items: ["칠요의 몬스터파커", "칠요의 뱃지"],
  },

  "쿠퍼 메탈 파츠 세트": {
    include: false,
    items: ["쿠퍼 엔진", "쿠퍼 머신 암", "쿠퍼 트렌지스터"],
  },
  "브론즈 메탈 파츠 세트": {
    include: false,
    items: [
      "브론즈 엔진",
      "브론즈 머신 암",
      "브론즈 머신 레그",
      "브론즈 바디 프레임",
      "브론즈 트렌지스터",
    ],
  },
  "아이언 메탈 파츠 세트": {
    include: false,
    items: [
      "아이언 엔진",
      "아이언 머신 암",
      "아이언 머신 레그",
      "아이언 바디 프레임",
      "아이언 트렌지스터",
    ],
  },
  "골드 메탈 파츠 세트": {
    include: false,
    items: [
      "골드 엔진",
      "골드 머신 암",
      "골드 머신 레그",
      "골드 바디 프레임",
      "골드 트렌지스터",
    ],
  },
  "퓨어 골드 메탈 파츠 세트": {
    include: false,
    items: [
      "퓨어 골드 엔진",
      "퓨어 골드 머신 암",
      "퓨어 골드 머신 레그",
      "퓨어 골드 바디 프레임",
      "퓨어 골드 트렌지스터",
    ],
  },
};

const WEAPON_ATTACK_SPEED: Record<string, number> = {
  한손검: 5,
  한손도끼: 5,
  한손둔기: 5,
  데스페라도: 4,
  튜너: 6,
  장검: 6,
  스태프: 2,
  완드: 4,
  샤이닝로드: 4,
  ESP리미터: 4,
  매직건틀렛: 4,
  메모리얼스태프: 4,
  브레스슈터: 6,
  단검: 6,
  케인: 5,
  체인: 6,
  부채: 6,
  소울슈터: 5,
  에너지소드: 5,
  두손검: 4,
  두손도끼: 4,
  두손둔기: 4,
  창: 4,
  폴암: 5,
  태도: 4,
  대검: 2,
  건틀렛리볼버: 5,
  카타나: 5,
  활: 4,
  석궁: 4,
  듀얼보우건: 4,
  에이션트보우: 4,
  아대: 6,
  차크람: 6,
  너클: 5,
  건: 5,
  핸드캐논: 2,
  무권: 6,
};

const STAT_CONFIG: { key: keyof ItemTotalOption; label: string }[] = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "int", label: "INT" },
  { key: "luk", label: "LUK" },
  { key: "all_stat", label: "올스탯" },
  { key: "max_hp", label: "최대 HP" },
  { key: "max_mp", label: "최대 MP" },
  { key: "max_hp_rate", label: "최대 HP" },
  { key: "max_mp_rate", label: "최대 MP" },
  { key: "attack_power", label: "공격력" },
  { key: "magic_power", label: "마력" },
  { key: "armor", label: "방어력" },
  { key: "damage", label: "데미지" },
  { key: "boss_damage", label: "보스 몬스터 데미지" },
  { key: "ignore_monster_armor", label: "몬스터 방어율 무시" },
  { key: "speed", label: "이동속도" },
  { key: "jump", label: "점프력" },
];

export default function ItemTooltip({ item, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [item, visible]);

  if (!item) return <>{children}</>;

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
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

  const getTooltipPosition = (): React.CSSProperties => {
    if (typeof window === "undefined") return {};

    const { innerWidth, innerHeight } = window;
    const { x, y } = mousePos;
    const { width, height } = tooltipSize;
    const gap = 15;

    let top = y + gap;
    let left = x + gap;

    if (top + height > innerHeight) {
      top = y - height - gap;
    }

    if (top < 0) {
      top = Math.max(0, innerHeight - height - gap);
    }

    if (left + width > innerWidth) {
      left = x - width - gap;
    }

    if (left < 0) left = gap;

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
      pointerEvents: "none",
    };
  };

  //console.log(item);
  let expireDateText = "";

  if (item.date_expire) {
    const expireDate = new Date(item.date_expire);
    expireDateText = `${expireDate.getFullYear()}년 ${
      expireDate.getMonth() + 1
    }월 ${expireDate.getDate()}일 00시 00분`;
  }

  return (
    <>
      <div
        className={`w-full h-full flex justify-center items-center cursor-pointer`}
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
            ref={tooltipRef}
            className="w-[400px] bg-gray-900/95 border border-gray-600 rounded-md p-3 text-xs text-gray-100 shadow-2xl backdrop-blur-sm galmuri"
            style={getTooltipPosition()}
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

            {item.date_expire && (
              <div className="flex flex-col justify-center items-center">
                <p className="galmuri text-md text-amber-500">
                  유효 기간 : {expireDateText} (연장 불가)
                </p>
              </div>
            )}

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
                <div className="flex gap-1 mt-2">
                  <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                    {["대검", "태도"].includes(item.item_equipment_part)
                      ? "무기"
                      : Object.entries(ITEM_TAG).find(([key, values]) =>
                          values.includes(item.item_equipment_slot)
                        )?.[0]}
                  </p>

                  {(item.item_equipment_slot === "무기" ||
                    (item.item_equipment_slot === "보조무기" &&
                      ["대검", "태도"].includes(item.item_equipment_part))) && (
                    <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                      {
                        Object.entries(WEAPON_HAND).find(([key, values]) =>
                          values.includes(item.item_equipment_part.trim())
                        )?.[0]
                      }
                    </p>
                  )}

                  {item.item_equipment_slot === "무기" ||
                    (item.item_equipment_slot === "보조 무기" &&
                      ["대검", "태도"].includes(item.item_equipment_part) && (
                        <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                          {
                            Object.entries(WEAPON_HAND).find(([key, values]) =>
                              values.includes(item.item_equipment_part)
                            )?.[0]
                          }
                        </p>
                      ))}
                  {!["포켓 아이템", "기계 심장", "뱃지", "훈장"].includes(
                    item.item_equipment_part
                  ) && (
                    <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                      {item.item_equipment_part}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 mt-3">
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <p className="galmuri text-gray-400">착용 직업</p>
                  <p className="galmuri text-start">공용</p>
                </div>
                {item.item_base_option.base_equipment_level !== 0 && (
                  <div className="grid grid-cols-2">
                    <p className="galmuri text-gray-400">요구 레벨</p>
                    <p className="galmuri text-start">
                      Lv. {item.item_base_option.base_equipment_level}
                    </p>
                  </div>
                )}
              </div>

              {item.item_gender && (
                <div className="grid grid-rows-2">
                  <div></div>
                  <div className="grid grid-cols-[7.5fr_2.5fr]">
                    <p className="galmuri text-gray-400 text-end">착용 성별</p>
                    <p className="galmuri text-amber-500 text-end">
                      {item.item_gender}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            <div className="flex flex-col">
              {/* <div className="w-full grid grid-cols-[1fr_3fr]">
                <p className="galmuri text-gray-400">세트 효과</p>
                <p className="galmuri text-gray-400">아케인셰이드 세트(전사)</p>
              </div> */}
              {(item.item_equipment_slot === "무기" ||
                (item.item_equipment_slot === "보조무기" &&
                  ["대검", "태도"].includes(item.item_equipment_part))) && (
                <div className="w-full grid grid-cols-[1fr_3fr]">
                  <p className="galmuri text-gray-400">공격 속도</p>
                  <p className="galmuri text-gray-400">
                    {WEAPON_ATTACK_SPEED[item.item_equipment_part]}단계
                  </p>
                </div>
              )}
              {STAT_CONFIG.map((config) => {
                const value = item.item_total_option[config.key];
                const baseValue =
                  (item.item_base_option as unknown as Record<string, string>)[
                    config.key
                  ] || "0";
                const addValue =
                  (item.item_add_option as unknown as Record<string, string>)[
                    config.key
                  ] || "0";
                const etcValue =
                  (item.item_etc_option as Record<string, string>)[
                    config.key
                  ] || "0";
                const starforceValue =
                  (item.item_starforce_option as Record<string, string>)[
                    config.key
                  ] || "0";

                if (value === "0") return null;

                const isPercent = [
                  "all_stat",
                  "boss_damage",
                  "ignore_monster_armor",
                  "max_hp_rate",
                  "max_mp_rate",
                  "damage",
                ].includes(config.key);

                const showDetail =
                  addValue !== "0" ||
                  etcValue !== "0" ||
                  starforceValue !== "0";

                return (
                  <div key={config.key} className="w-full flex">
                    <p className="galmuri text-[11px]">{config.label}</p>
                    <p className="galmuri text-[11px] ms-3.5">
                      +{value}
                      {isPercent && "%"}
                      {showDetail && (
                        <span>
                          {" "}
                          ({baseValue}
                          {isPercent && "%"}
                          <span className="text-yellow-400">
                            {starforceValue !== "0" &&
                              ` +${starforceValue}${isPercent ? "%" : ""}`}
                          </span>
                          <span className="text-violet-400">
                            {etcValue !== "0" &&
                              ` +${etcValue}${isPercent ? "%" : ""}`}
                          </span>
                          <span className="text-teal-500">
                            {addValue !== "0" &&
                              ` +${addValue}${isPercent ? "%" : ""}`}
                          </span>
                          )
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col mt-1">
              {(item.scroll_upgrade !== "0" ||
                item.scroll_upgradeable_count !== "0") && (
                <p
                  className={`galmuri text-[11px] ${
                    item.scroll_upgradeable_count !== "0" && "text-gray-400"
                  }`}
                >
                  주문서 강화 {item.scroll_upgrade}회 (잔여{" "}
                  {item.scroll_upgradeable_count}회, 복구 가능{" "}
                  {item.scroll_resilience_count}회)
                </p>
              )}
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            {item.potential_option_grade && (
              <>
                <div className="flex flex-col">
                  {gradeIcon(item.potential_option_grade)}
                </div>
                <div className="flex galmuri text-[11px] items-center mt-1">
                  {gradeIconSmall(item.potential_option_grade)}
                  <p>{item.potential_option_1}</p>
                </div>
                <div className="flex galmuri text-[11px] items-center mt-1">
                  {gradeIconSmall(gradePrev(item.potential_option_grade))}
                  <p>{item.potential_option_2}</p>
                </div>
                {item.potential_option_3 && (
                  <div className="flex galmuri text-[11px] items-center mt-1">
                    {gradeIconSmall(gradePrev(item.potential_option_grade))}
                    <p>{item.potential_option_3}</p>
                  </div>
                )}
              </>
            )}

            {item.additional_potential_option_grade && (
              <>
                <div className="flex flex-col mt-2">
                  {gradeIcon(item.additional_potential_option_grade)}
                </div>
                <div className="flex galmuri text-[11px] items-center mt-1">
                  {gradeIconSmall(item.additional_potential_option_grade)}
                  <p>{item.additional_potential_option_1}</p>
                </div>
                <div className="flex galmuri text-[11px] items-center mt-1">
                  {gradeIconSmall(
                    gradePrev(item.additional_potential_option_grade)
                  )}
                  <p>{item.additional_potential_option_2}</p>
                </div>
                {item.potential_option_3 && (
                  <div className="flex galmuri text-[11px] items-center mt-1">
                    {gradeIconSmall(
                      gradePrev(item.additional_potential_option_grade)
                    )}
                    <p>{item.additional_potential_option_3}</p>
                  </div>
                )}
              </>
            )}

            {item.soul_name && (
              <div className="flex flex-col mt-2">
                <p className="galmuri text-[11px] flex items-center">
                  <FontAwesomeIcon icon={faFire} className="me-1" /> 소울 :{" "}
                  {item.soul_name}
                </p>
                <p className="galmuri text-[11px] flex items-center mt-1">
                  {item.soul_option}
                </p>
              </div>
            )}

            {item.item_description && (
              <div className="flex mt-2">
                <p className="galmuri text-[11px] flex items-center">
                  {item.item_description}
                </p>
              </div>
            )}
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

function gradeIcon(grade: string) {
  switch (grade) {
    case "레전드리":
      return (
        <div className="flex items-center">
          <p className="text-gray-900/95 bg-lime-400 nexon text-[10px] font-bold w-3 h-3 flex justify-center items-center rounded-xs">
            L
          </p>
          <p className="text-lime-400 galmuri text-[11px] ms-1">
            잠재능력 : 레전드리
          </p>
        </div>
      );

    case "유니크":
      return (
        <div className="flex items-center">
          <p className="text-gray-900/95 bg-yellow-400 nexon text-[10px] font-bold w-3 h-3 flex justify-center items-center rounded-xs">
            U
          </p>
          <p className="text-yellow-400 galmuri text-[11px] ms-1">
            잠재능력 : 유니크
          </p>
        </div>
      );

    case "에픽":
      return (
        <div className="flex items-center">
          <p className="text-gray-900/95 bg-violet-400 nexon text-[10px] font-bold w-3 h-3 flex justify-center items-center rounded-xs">
            E
          </p>
          <p className="text-violet-400 galmuri text-[11px] ms-1">
            잠재능력 : 에픽
          </p>
        </div>
      );

    case "레어":
      return (
        <div className="flex items-center">
          <p className="text-gray-900/95 bg-sky-400 nexon text-[10px] font-bold w-3 h-3 flex justify-center items-center rounded-xs">
            R
          </p>
          <p className="text-sky-400 galmuri text-[11px] ms-1">
            잠재능력 : 레어
          </p>
        </div>
      );
  }
}

function gradeIconSmall(grade: string) {
  switch (grade) {
    case "레전드리":
      return (
        <div className="w-1 h-1 flex justify-center items-center bg-lime-400 ms-1 me-1"></div>
      );

    case "유니크":
      return (
        <div className="w-1 h-1 flex justify-center items-center bg-yellow-400 ms-1 me-1"></div>
      );

    case "에픽":
      return (
        <div className="w-1 h-1 flex justify-center items-center bg-violet-400 ms-1 me-1"></div>
      );

    default:
      return (
        <div className="w-1 h-1 flex justify-center items-center bg-sky-400 ms-1 me-1"></div>
      );
  }
}

function gradePrev(grade: string) {
  const gradeArray = ["노말", "레어", "에픽", "유니크", "레전드리"];

  if (gradeArray.indexOf(grade) === -1 || grade === "노말") return "노말";

  return gradeArray[gradeArray.indexOf(grade) - 1];
}

/**
 *
 * 태그 작성
 * 1. 장신구, 방어구, 포켓 아이템, 무기, 보조무기, 엠블렘/파워소스. 안드로이드, 기계 심장, 뱃지, 방어구, 어깨장식, 훈장
 * 2. 한손, 두손
 * 3. 장신구 ( 반지, 벨트, 얼굴장식, 눈장식, 귀고리, 펜던트 ), 무기 ( 두손검, 한손검, ...), 보조무기 ( 로자리오, ...) 엠블렘 ( 엠블렘, 파워소스 ), 방어구 ( 모자, 상의, 하의, ... )
 */
