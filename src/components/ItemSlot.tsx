// src/components/ItemSlot.tsx

import { ItemData } from "@/app/user/[characterName]/page";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemTooltip from "./ItemTooltip";

type Props = {
  item?: ItemData;
  colStart?: number;
};

export default function ItemSlot({ item, colStart }: Props) {
  const gradeColor: Record<string, string> = {
    레전드리: "border-lime-400",
    유니크: "border-yellow-400",
    에픽: "border-violet-400",
    레어: "border-sky-400",
  };

  const borderColor = item?.potential_option_grade
    ? gradeColor[item.potential_option_grade]
    : "border-gray-300";

  return (
    <div
      className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center relative ${borderColor} ${
        colStart ? `col-start-${colStart}` : ""
      }`}
    >
      <ItemTooltip item={item}>
        {item?.date_expire && (
          <FontAwesomeIcon
            icon={faClock}
            className="absolute text-xs text-red-500 z-1 top-2 left-2 rounded-[100px] bg-white w-3! h-3!"
          />
        )}

        {item ? (
          <>
            <div className="relative w-full flex justify-center items-center">
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_70%)] z-0"></div>
              <img
                src={item.item_shape_icon}
                alt={item.item_name}
                className="relative z-10 object-contain scale-[1.3] [image-rendering:pixelated]"
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </ItemTooltip>
    </div>
  );
}
