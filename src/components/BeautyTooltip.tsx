// src/components/BeautyTooltip.tsx

"use client";

import {
  AndroidPreset,
  BeautyFace,
  BeautyHair,
  BeautySkin,
  ItemData,
  ItemTotalOption,
} from "@/app/user/[characterName]/page";
import { faComputerMouse, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { includes } from "zod";

interface Props {
  beautyName?: string;
  children: React.ReactNode;
}

export default function BeautyTooltip({ beautyName, children }: Props) {
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
  }, [beautyName, visible]);

  if (!beautyName) return <>{children}</>;

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
            className=" bg-gray-900/95 border border-gray-600 rounded-md p-1 text-xs text-gray-100 shadow-2xl backdrop-blur-sm galmuri"
            style={getTooltipPosition()}
          >
            <div className="flex flex-col justify-center items-center">
              <p className="galmuri text-md whitespace-pre-wrap">
                {beautyName}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
