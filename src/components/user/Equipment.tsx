// src/components/user/Equipment.tsx

import { CharacterWithRaw, ItemData } from "@/app/user/[characterName]/page";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import ItemSlot from "../ItemSlot";

const EQUIPMENT_SLOTS = [
  // ROW 1
  { slot: "반지4" },
  { slot: "얼굴장식" },
  { slot: "모자", colStart: 6 },
  { slot: "망토" },

  // ROW 2
  { slot: "반지3" },
  { slot: "눈장식" },
  { slot: "상의", colStart: 6 },
  { slot: "장갑" },

  // ROW 3
  { slot: "반지2" },
  { slot: "귀고리" },
  { slot: "하의", colStart: 6 },
  { slot: "신발" },

  // ROW 4
  { slot: "반지1" },
  { slot: "펜던트2" },
  { slot: "어깨장식", colStart: 6 },
  { slot: "훈장" },

  // ROW 5
  { slot: "벨트" },
  { slot: "펜던트" },
  { slot: "무기" },
  { slot: "보조무기" },
  { slot: "엠블렘" },
  { slot: "null" },
  { slot: "기계 심장" },

  // ROW 6
  { slot: "포켓 아이템" },
  { slot: "뱃지", colStart: 7 },
];

type Props = {
  characterData: CharacterWithRaw;
};

export default function Equipment({ characterData }: Props) {
  const initialPreset = Number(characterData.raw_item_equipment.preset_no) - 1;
  const [preset, setPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );

  const currentItemMap = useMemo(() => {
    const targetList = [
      characterData.raw_item_equipment.item_equipment_preset_1,
      characterData.raw_item_equipment.item_equipment_preset_2,
      characterData.raw_item_equipment.item_equipment_preset_3,
    ][preset];

    if (!targetList) return {};

    return targetList.reduce((acc, item) => {
      acc[item.item_equipment_slot] = item;
      return acc;
    }, {} as Record<string, ItemData>);
  }, [characterData, preset]);

  return (
    <div>
      <div className="w-full flex justify-end mt-10">
        <button className="bg-gray-700 text-white nexon rounded-3xl px-12 py-0.75 shadow-lg relative hover:bg-gray-800 hover:cursor-pointer">
          치장
          <p className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <FontAwesomeIcon icon={faAngleRight} />
          </p>
        </button>
      </div>

      <div className="w-full flex justify-center mt-10">
        <div className="grid grid-cols-7 gap-1">
          {EQUIPMENT_SLOTS.map((slotInfo, index) => {
            if (!slotInfo.slot)
              return (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-200 rounded-sm border-2 border-gray-500"
                ></div>
              );

            const item = currentItemMap[slotInfo.slot];

            return (
              <ItemSlot
                key={slotInfo.slot}
                item={item}
                colStart={slotInfo.colStart}
              />
            );
          })}
        </div>
      </div>

      <div className="w-full flex justify-center mt-10">
        <div className="w-[50%] bg-gray-400 flex justify-between items-center rounded-2xl text-white px-3 py-1">
          <p className="nexon text-sm text-shadow-lg">PRESETS</p>

          <div className="grid grid-cols-3 gap-2">
            <div
              className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                preset === 0
                  ? "bg-gray-600 border-white"
                  : "bg-gray-400 border-gray-500"
              }`}
              onClick={() => setPreset(0)}
            >
              <p className="text-center text-bold nexon">1</p>
            </div>

            <div
              className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                preset === 1
                  ? "bg-gray-600 border-white"
                  : "bg-gray-400 border-gray-500"
              }`}
              onClick={() => setPreset(1)}
            >
              <p className="text-center text-bold nexon">2</p>
            </div>

            <div
              className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                preset === 2
                  ? "bg-gray-600 border-white"
                  : "bg-gray-400 border-gray-500"
              }`}
              onClick={() => setPreset(2)}
            >
              <p className="text-center text-bold nexon">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
