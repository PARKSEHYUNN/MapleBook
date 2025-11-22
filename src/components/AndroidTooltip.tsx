// src/components/AndroidTooltip.tsx

"use client";

import {
  AndroidPreset,
  ItemData,
  ItemTotalOption,
} from "@/app/user/[characterName]/page";
import { faComputerMouse, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { includes } from "zod";

interface Props {
  android?: AndroidPreset;
  children: React.ReactNode;
}

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

export default function AndroidTooltip({ android, children }: Props) {
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
  }, [android, visible]);

  if (!android) return <>{children}</>;

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

  //console.log(item);

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
              <p className="galmuri text-lg">{android.android_name}</p>
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            <div className="grid grid-cols-[2fr_8fr]">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex justify-center items-center relative">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_70%)] z-0"></div>
                <img
                  src={android.android_icon}
                  alt={android.android_name || "아이템 툴팁 이미지"}
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
                    안드로이드
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 mt-3">
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <p className="galmuri text-gray-400">착용 직업</p>
                  <p className="galmuri text-start">공용</p>
                </div>

                <div className="grid grid-cols-2">
                  <p className="galmuri text-gray-400">요구 레벨</p>
                  <p className="galmuri text-start">Lv. 10</p>
                </div>
              </div>
            </div>

            <div className="mt-2 mb-2 border-b border-gray-600/50 shadow-lg w-full"></div>

            <div className="flex flex-col">
              <p className="text-[11px] galmuri">
                등급: {android.android_grade}
              </p>
              <p className="text-[11px] galmuri whitespace-pre-wrap">
                {android.android_description}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
