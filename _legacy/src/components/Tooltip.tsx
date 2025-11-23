// src/components/Tooltip.tsx

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

export default function TookTip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 100,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>
          <span
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            tabIndex={0}
            className={`cursor-help transition-all duration-200 rounded px-2 py-1 -mx-1 ${
              open
                ? "bg-gray-600 shadow-sm" // 툴팁 열렸을 때 (강조)
                : "hover:bg-white/10" // 툴팁 닫혔지만 마우스 올렸을 때 (살짝 표시)
            }`}
          >
            {children}
          </span>
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={5}
            className="z-50 overflow-hidden rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-in-from-top-2 data-[state=closed]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
