// src/components/CashTooltip.tsx

"use client";

import {
  AndroidPreset,
  CashItemMap,
  ItemData,
  ItemTotalOption,
} from "@/app/user/[characterName]/page";
import { faComputerMouse, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { includes } from "zod";

interface Props {
  cash?: CashItemMap;
  type?: "base" | "preset";
  children: React.ReactNode;
}

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

export default function CashTooltip({ cash, type = "base", children }: Props) {
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
  }, [cash, visible]);

  if (!cash) return <>{children}</>;

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

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
            <div className="flex flex-col justify-center items-center">
              <p className="galmuri text-lg">{cash.cash_item_name}</p>
              {cash.cash_item_label && (
                <p className="galmuri text-sm text-gray-400">
                  {cash.cash_item_label}
                </p>
              )}
              <p className="galmuri text-md text-amber-500">교환 불가</p>
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            <div className="grid grid-cols-[2fr_8fr]">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex justify-center items-center relative">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_70%)] z-0"></div>
                <img
                  src={cash.cash_item_icon}
                  alt={cash.cash_item_name || "아이템 툴팁 이미지"}
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
                    {
                      Object.entries(ITEM_TAG).find(([key, values]) =>
                        values.includes(cash.cash_item_equipment_slot)
                      )?.[0]
                    }
                  </p>
                  {!["포켓 아이템", "기계 심장", "뱃지", "훈장"].includes(
                    cash.cash_item_equipment_part
                  ) && (
                    <p className="rounded-xl bg-gray-700 text-gray-400 galmuir px-3 py-0.5 flex justify-center items-center">
                      {cash.cash_item_equipment_part}
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
              </div>
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            <div className="flex flex-col">
              {/* {STAT_CONFIG.map((config) => {
                const value = cashOptionMap[config.key];

                if (!value || value === "0") return null;

                const isPercent = [
                  "all_stat",
                  "boss_damage",
                  "ignore_monster_armor",
                  "max_hp_rate",
                  "max_mp_rate",
                  "damage",
                ].includes(config.key);

                return (
                  <div key={config.key} className="w-full flex">
                    <p className="galmuri text-[11px]">{config.label}</p>
                    <p className="galmuri text-[11px] ms-3.5">
                      +{value}
                      {isPercent && "%"} (0{" "}
                      <span className="text-amber-200">
                        +{value}
                        {isPercent}
                      </span>
                      )
                    </p>
                  </div>
                );
              })} */}
              {(() => {
                // API 배열을 { "공격력": "30", "STR": "10" } 형태의 객체로 변환
                const cashOptionMap = cash.cash_item_option.reduce(
                  (acc: any, cur: any) => {
                    acc[cur.option_type] = cur.option_value;
                    return acc;
                  },
                  {} as Record<string, string>
                );

                // 2. STAT_CONFIG 순서대로 순회
                return STAT_CONFIG.map((config) => {
                  // config.key가 아닌 config.label(한글 명칭)로 값을 찾습니다.
                  const value = cashOptionMap[config.label];

                  // 값이 없거나 0이면 렌더링 안 함
                  if (!value || value === "0") return null;

                  // % 표시가 필요한 옵션인지 확인
                  const isPercent = [
                    "all_stat",
                    "boss_damage",
                    "ignore_monster_armor",
                    "max_hp_rate", // 최대 HP (통상 %)
                    "max_mp_rate", // 최대 MP (통상 %)
                    "damage",
                  ].includes(config.key);

                  // (예외 처리) 만약 API 값 자체에 이미 %가 포함되어 있다면 isPercent 무시
                  const displayValue = value.includes("%")
                    ? value
                    : `${value}${isPercent ? "%" : ""}`;

                  return (
                    <div key={config.key} className="w-full flex">
                      <p className="galmuri text-[11px] text-gray-400">
                        {config.label}
                      </p>
                      <p className="galmuri text-[11px] text-white ms-3.5">
                        +{displayValue} (0{" "}
                        <span className="text-amber-200">+{value}</span>)
                      </p>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="flex flex-col">
              {cash.cash_item_description && (
                <p className="text-[11px] galmuri whitespace-pre-wrap">
                  {cash.cash_item_description}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              {type === "preset" && (
                <p className="text-[11px] galmuri whitespace-pre-wrap">
                  코디 프리셋에 장착한 아이템은 외형에만 적용되며, 옵션 적용을
                  원할 경우 치장창에 착용해주세요.
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
