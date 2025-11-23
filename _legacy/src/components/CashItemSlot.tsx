// src/components/CashItemSlot.tsx

import { CashItemMap } from "@/app/user/[characterName]/page";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemTooltip from "./ItemTooltip";
import CashTooltip from "./CashTooltip";

type Props = {
  cash?: CashItemMap;
  type?: "base" | "preset";
  colStart?: string;
};

export default function CashItemSlot({ cash, type = "base", colStart }: Props) {
  return (
    <div
      className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center relative border-gray-300 ${
        colStart ? colStart : ""
      }`}
    >
      <CashTooltip cash={cash} type={type}>
        {cash ? (
          <>
            <div className="relative w-full flex justify-center items-center">
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_70%)] z-0"></div>
              <img
                src={cash.cash_item_icon}
                alt={cash.cash_item_name}
                className="relative z-10 object-contain scale-[1.3] [image-rendering:pixelated]"
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </CashTooltip>
    </div>
  );
}
