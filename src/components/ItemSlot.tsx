// src/components/ItemSlot.tsx

import { ItemData } from "@/app/user/[characterName]/page";

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
      className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center ${borderColor} ${
        colStart ? `col-start-${colStart}` : ""
      }`}
    >
      {item ? (
        <>
          <img
            src={item.item_shape_icon}
            alt={item.item_name}
            className="scale-[1.3]"
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
