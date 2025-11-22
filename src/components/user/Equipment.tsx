// src/components/user/Equipment.tsx

import {
  CashItemMap,
  CharacterWithRaw,
  ItemData,
} from "@/app/user/[characterName]/page";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useMemo, useState } from "react";
import ItemSlot from "../ItemSlot";
import ItemTooltip from "../ItemTooltip";
import AndroidTooltip from "../AndroidTooltip";
import CashItemSlot from "../CashItemSlot";
import BeautyTooltip from "../BeautyTooltip";

const EQUIPMENT_SLOTS = [
  // ROW 1
  { slot: "반지4" },
  { slot: "얼굴장식" },
  { slot: "모자", colStart: "col-start-6" },
  { slot: "망토" },

  // ROW 2
  { slot: "반지3" },
  { slot: "눈장식" },
  { slot: "상의", colStart: "col-start-6" },
  { slot: "장갑" },

  // ROW 3
  { slot: "반지2" },
  { slot: "귀고리" },
  { slot: "하의", colStart: "col-start-6" },
  { slot: "신발" },

  // ROW 4
  { slot: "반지1" },
  { slot: "펜던트2" },
  { slot: "어깨장식", colStart: "col-start-6" },
  { slot: "훈장" },

  // ROW 5
  { slot: "벨트" },
  { slot: "펜던트" },
  { slot: "무기" },
  { slot: "보조무기" },
  { slot: "엠블렘" },
  { slot: "안드로이드" },
  { slot: "기계 심장" },

  // ROW 6
  { slot: "포켓 아이템" },
  { slot: "뱃지", colStart: "col-start-7" },
];

const CASH_EQUIPMENT_SLOTS = [
  // ROW 1
  { slot: "반지4" },
  { slot: "얼굴장식" },
  { slot: "모자", colStart: "col-start-6" },
  { slot: "망토" },

  // ROW 2
  { slot: "반지3" },
  { slot: "눈장식" },
  { slot: "상의", colStart: "col-start-6" },
  { slot: "장갑" },

  // ROW 3
  { slot: "반지2" },
  { slot: "귀고리" },
  { slot: "하의", colStart: "col-start-6" },
  { slot: "신발" },

  // ROW 4
  { slot: "반지1" },
  { slot: "무기", colStart: "col-start-6" },
  { slot: "보조무기" },

  // ROW 5
  { slot: "헤어", colStart: "col-start-3" },
  { slot: "성형" },
  { slot: "피부" },
];

const CASH_PRESET_EQUIPMENT_SLOTS = [
  // ROW 1
  { slot: "반지4" },
  { slot: "얼굴장식" },
  { slot: "모자", colStart: "col-start-6" },
  { slot: "망토" },

  // ROW 2
  { slot: "반지3" },
  { slot: "눈장식" },
  { slot: "상의", colStart: "col-start-6" },
  { slot: "장갑" },

  // ROW 3
  { slot: "반지2" },
  { slot: "귀고리" },
  { slot: "하의", colStart: "col-start-6" },
  { slot: "신발" },

  // ROW 4
  { slot: "반지1" },
  { slot: "무기", colStart: "col-start-6" },
  { slot: "보조무기" },
];

type Props = {
  characterData: CharacterWithRaw;
};

export default function Equipment({ characterData }: Props) {
  const initialPreset = Number(characterData.raw_item_equipment.preset_no) - 1;
  const [preset, setPreset] = useState(
    isNaN(initialPreset) ? 0 : initialPreset
  );

  const cashInitialPreset =
    characterData.raw_cashitem_equipment.preset_no === null
      ? 0
      : Number(characterData.raw_cashitem_equipment.preset_no) - 1;
  const [cashPreset, setCashPreset] = useState(
    isNaN(cashInitialPreset) ? 0 : cashInitialPreset
  );
  const [page, setPage] = useState("장비");

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

  const currentCashItemMap = useMemo(() => {
    const targetList =
      characterData.raw_cashitem_equipment.cash_item_equipment_base;

    return targetList.reduce((acc, cash) => {
      acc[cash.cash_item_equipment_slot] = cash;
      return acc;
    }, {} as Record<string, CashItemMap>);
  }, [characterData]);

  const currentCashPresetItemMap = useMemo(() => {
    const targetList = [
      characterData.raw_cashitem_equipment.cash_item_equipment_preset_1,
      characterData.raw_cashitem_equipment.cash_item_equipment_preset_2,
      characterData.raw_cashitem_equipment.cash_item_equipment_preset_3,
    ][cashPreset];

    console.log(targetList);

    return targetList.reduce((acc, cash) => {
      acc[cash.cash_item_equipment_slot] = cash;
      return acc;
    }, {} as Record<string, CashItemMap>);
  }, [characterData, cashPreset]);

  const currentAndriod = useMemo(() => {
    const androidData = characterData.raw_android_equipment;

    const targetAndroid = [
      androidData.android_preset_1,
      androidData.android_preset_2,
      androidData.android_preset_3,
    ][preset];

    return targetAndroid || androidData.android_preset_1;
  }, [characterData.raw_android_equipment, preset]);

  if (page === "장비")
    return (
      <div>
        <div className="w-full flex justify-end mt-10">
          <button
            className="bg-gray-700 text-white nexon rounded-3xl w-40 py-0.75 shadow-lg relative hover:bg-gray-800 hover:cursor-pointer"
            onClick={() => setPage("치장")}
          >
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

              if (slotInfo.slot === "안드로이드") {
                return (
                  <div
                    className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center border-gray-300 ${
                      slotInfo.colStart ? slotInfo.colStart : ""
                    }`}
                    key={slotInfo.slot}
                  >
                    {currentAndriod ? (
                      <>
                        <AndroidTooltip android={currentAndriod}>
                          <img
                            src={currentAndriod.android_icon}
                            alt={currentAndriod.android_name}
                            className="scale-[1.3]"
                          />
                        </AndroidTooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }

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
                  initialPreset === 0 ? "bg-gray-600" : "bg-gray-400"
                } ${preset === 0 ? "border-white" : "border-gray-500"}`}
                onClick={() => setPreset(0)}
              >
                <p className="text-center text-bold nexon">1</p>
              </div>

              <div
                className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                  initialPreset === 1 ? "bg-gray-600" : "bg-gray-400"
                } ${preset === 1 ? "border-white" : "border-gray-500"}`}
                onClick={() => setPreset(1)}
              >
                <p className="text-center text-bold nexon">2</p>
              </div>

              <div
                className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                  initialPreset === 2 ? "bg-gray-600" : "bg-gray-400"
                } ${preset === 2 ? "border-white" : "border-gray-500"}`}
                onClick={() => setPreset(2)}
              >
                <p className="text-center text-bold nexon">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  else if (page === "치장") {
    const hairName =
      characterData.raw_beauty_equipment.character_hair.mix_color === null
        ? characterData.raw_beauty_equipment.character_hair.hair_name
        : `믹스 ${
            characterData.raw_beauty_equipment.character_hair.hair_name
          } ( ${characterData.raw_beauty_equipment.character_hair.base_color} ${
            100 -
            Number(characterData.raw_beauty_equipment.character_hair.mix_rate)
          } : ${characterData.raw_beauty_equipment.character_hair.mix_color} ${
            characterData.raw_beauty_equipment.character_hair.mix_rate
          })`;

    const faceName =
      characterData.raw_beauty_equipment.character_face.mix_color === null
        ? characterData.raw_beauty_equipment.character_face.face_name
        : `믹스 ${
            characterData.raw_beauty_equipment.character_face.face_name
          } ( ${characterData.raw_beauty_equipment.character_face.base_color} ${
            100 -
            Number(characterData.raw_beauty_equipment.character_face.mix_rate)
          } : ${characterData.raw_beauty_equipment.character_face.mix_color} ${
            characterData.raw_beauty_equipment.character_face.mix_rate
          })`;

    const skinName =
      characterData.raw_beauty_equipment.character_skin.color_style === null
        ? characterData.raw_beauty_equipment.character_skin.skin_name
        : `${characterData.raw_beauty_equipment.character_skin.skin_name}\n\n${
            characterData.raw_beauty_equipment.character_skin.color_style
          }, 색조 ${
            characterData.raw_beauty_equipment.character_skin.hue >= 0
              ? `+${characterData.raw_beauty_equipment.character_skin.hue}`
              : characterData.raw_beauty_equipment.character_skin.hue
          }, 채도 ${
            characterData.raw_beauty_equipment.character_skin.saturation >= 0
              ? `+${characterData.raw_beauty_equipment.character_skin.saturation}`
              : characterData.raw_beauty_equipment.character_skin.saturation
          }, 명도 ${
            characterData.raw_beauty_equipment.character_skin.brightness >= 0
              ? `+${characterData.raw_beauty_equipment.character_skin.brightness}`
              : characterData.raw_beauty_equipment.character_skin.brightness
          }`;

    return (
      <div>
        <div className="w-full flex justify-end mt-10">
          <button
            className="bg-gray-700 text-white nexon rounded-3xl w-40 py-0.75 shadow-lg relative hover:bg-gray-800 hover:cursor-pointer"
            onClick={() => setPage("장비")}
          >
            장비
            <p className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <FontAwesomeIcon icon={faAngleRight} />
            </p>
          </button>
        </div>

        <div className="w-full flex justify-end mt-1">
          <button
            className="bg-gray-700 text-white nexon rounded-3xl w-40 py-0.75 shadow-lg relative hover:bg-gray-800 hover:cursor-pointer"
            onClick={() => setPage("코디 프리셋")}
          >
            코디 프리셋
            <p className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <FontAwesomeIcon icon={faAngleRight} />
            </p>
          </button>
        </div>

        <div className="w-full flex justify-center mt-10">
          <div className="grid grid-cols-7 gap-1">
            {CASH_EQUIPMENT_SLOTS.map((slotInfo, index) => {
              if (!slotInfo.slot)
                return (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gray-200 rounded-sm border-2 border-gray-500"
                  ></div>
                );

              if (slotInfo.slot === "헤어") {
                return (
                  <div
                    className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center border-gray-300 ${
                      slotInfo.colStart ? slotInfo.colStart : ""
                    }`}
                    key={slotInfo.slot}
                  >
                    {characterData.raw_beauty_equipment.character_hair ? (
                      <>
                        <BeautyTooltip beautyName={hairName}>
                          <img
                            src="/hair.png"
                            alt={hairName}
                            className="scale-[1.3]"
                          />
                        </BeautyTooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }

              if (slotInfo.slot === "성형") {
                return (
                  <div
                    className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center border-gray-300 ${
                      slotInfo.colStart ? slotInfo.colStart : ""
                    }`}
                    key={slotInfo.slot}
                  >
                    {characterData.raw_beauty_equipment.character_face ? (
                      <>
                        <BeautyTooltip beautyName={faceName}>
                          <img
                            src="/face.png"
                            alt={faceName}
                            className="scale-[1.3]"
                          />
                        </BeautyTooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }

              if (slotInfo.slot === "피부") {
                return (
                  <div
                    className={`w-16 h-16 border-2 rounded-sm bg-gray-200 flex items-center justify-center border-gray-300 ${
                      slotInfo.colStart ? slotInfo.colStart : ""
                    }`}
                    key={slotInfo.slot}
                  >
                    {characterData.raw_beauty_equipment.character_skin ? (
                      <>
                        <BeautyTooltip beautyName={skinName}>
                          <img
                            src="/skin.png"
                            alt={skinName}
                            className="scale-[1.3]"
                          />
                        </BeautyTooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }

              const cash = currentCashItemMap[slotInfo.slot];

              return (
                <CashItemSlot
                  key={slotInfo.slot}
                  cash={cash}
                  colStart={slotInfo.colStart}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (page === "코디 프리셋")
    return (
      <div>
        <div className="w-full flex justify-end mt-10">
          <button
            className="bg-gray-700 text-white nexon rounded-3xl w-40 py-0.75 shadow-lg relative hover:bg-gray-800 hover:cursor-pointer"
            onClick={() => setPage("치장")}
          >
            치장
            <p className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <FontAwesomeIcon icon={faAngleRight} />
            </p>
          </button>
        </div>

        <div className="w-full flex justify-center mt-10">
          <div className="grid grid-cols-7 gap-1">
            {CASH_PRESET_EQUIPMENT_SLOTS.map((slotInfo, index) => {
              if (!slotInfo.slot)
                return (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gray-200 rounded-sm border-2 border-gray-500"
                  ></div>
                );

              const cash = currentCashPresetItemMap[slotInfo.slot];
              //console.log(cash);

              return (
                <CashItemSlot
                  key={slotInfo.slot}
                  cash={cash}
                  type="preset"
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
                  cashInitialPreset === 0 ? "bg-gray-600" : "bg-gray-400"
                } ${cashPreset === 0 ? "border-white" : "border-gray-500"}`}
                onClick={() => setCashPreset(0)}
              >
                <p className="text-center text-bold nexon">1</p>
              </div>

              <div
                className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                  cashInitialPreset === 1 ? "bg-gray-600" : "bg-gray-400"
                } ${cashPreset === 1 ? "border-white" : "border-gray-500"}`}
                onClick={() => setCashPreset(1)}
              >
                <p className="text-center text-bold nexon">2</p>
              </div>

              <div
                className={`galmuri w-6 h-6 border rounded-lg text-xs flex justify-center items-center shadow-lg hover:cursor-pointer ${
                  cashInitialPreset === 2 ? "bg-gray-600" : "bg-gray-400"
                } ${cashPreset === 2 ? "border-white" : "border-gray-500"}`}
                onClick={() => setCashPreset(2)}
              >
                <p className="text-center text-bold nexon">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
