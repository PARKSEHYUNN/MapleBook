// src/app/user/page.ts

"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useHash } from "@/hooks/useHash";
import Image from "next/image";
import { Character } from "@prisma/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faAsterisk,
  faShieldHalved,
  faBookOpen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import CharacterAnimation from "@/components/CharacterAnimation";
import Board from "@/components/user/Board";
import Swal from "sweetalert2";
import Details from "@/components/user/Details";
import Equipment from "@/components/user/Equipment";

const TABS = [
  { id: "board", label: "방명록", icon: faChalkboard },
  { id: "details", label: "상세 정보", icon: faAsterisk },
  { id: "equipment", label: "장착 아이템", icon: faShieldHalved },
  { id: "skill", label: "스킬", icon: faBookOpen },
];

const getValidTabId = (hash: string) => {
  const tabId = hash.substring(1);
  const isValid = TABS.some((tab) => tab.id === tabId);
  return isValid ? tabId : TABS[0].id;
};

type Props = {
  params: Promise<{ characterName: string }>;
};

export type CharacterWithRaw = Omit<
  Character,
  | "raw_dojang"
  | "raw_union"
  | "raw_stat"
  | "raw_hyper_stat"
  | "raw_ability"
  | "raw_item_equipment"
> & {
  raw_dojang: RawDojang;
  raw_union: RawUnion;
  raw_stat: RawStat;
  raw_hyper_stat: RawHyperStat;
  raw_ability: RawAbility;
  raw_item_equipment: RawItemEquipment;
};

type RawDojang = {
  character_class: string;
  date: Date | null;
  date_dojang_record: Date | null;
  dojang_best_floor: number;
  dojang_best_time: number;
  world_name: string;
};

type RawUnion = {
  date: Date | null;
  union_artifact_exp: number | null;
  union_artifact_level: number | null;
  union_artifact_point: number | null;
  union_grade: string | null;
  union_level: number | null;
};

type RawStat = {
  character_class: string;
  date: Date | null;
  final_stat: Array<FinalStat>;
};

type FinalStat = {
  stat_name: string;
  stat_value: string;
};

type RawHyperStat = {
  character_class: string;
  date: Date | null;
  hyper_stat_preset_1: Array<HyperStatPreset>;
  hyper_stat_preset_1_remain_point: number;
  hyper_stat_preset_2: Array<HyperStatPreset>;
  hyper_stat_preset_2_remain_point: number;
  hyper_stat_preset_3: Array<HyperStatPreset>;
  hyper_stat_preset_3_remain_point: number;
  use_available_hyper_stat: number;
  use_preset_no: string;
};

type HyperStatPreset = {
  stat_increase: string;
  stat_level: number;
  stat_point: number;
  stat_type: string;
};

type RawAbility = {
  ability_grade: string;
  ability_info: Array<AbilityInfo>;
  ability_preset_1: AbilityPreset;
  ability_preset_2: AbilityPreset;
  ability_preset_3: AbilityPreset;
  date: Date | null;
  preset_no: number;
  remain_fame: number;
};

type AbilityInfo = {
  ability_grade: string;
  ability_no: string;
  ability_value: string;
};

type AbilityPreset = {
  ability_info: Array<AbilityInfo>;
  ability_preset_grade: string;
};

type RawItemEquipment = {
  character_class: string;
  character_gender: string;
  date: Date | null;
  preset_no: number;
  dragon_equipment: Array<ItemData>;
  item_equipment_preset_1: Array<ItemData>;
  item_equipment_preset_2: Array<ItemData>;
  item_equipment_preset_3: Array<ItemData>;
  title: TitleData;
  medal_shape: MedalShape;
  mechanic_equipment: Array<ItemData>;
};

export type ItemData = {
  item_equipment_part: string;
  item_equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description: string;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender: string;
  item_total_option: ItemTotalOption;
  item_base_option: ItemBaseOption;
  potential_option_flag: string;
  additional_potential_option_flag: string;
  potential_option_grade: string;
  additional_potential_option_grade: string;
  potential_option_1: string;
  potential_option_2: string;
  potential_option_3: string;
  additional_potential_option_1: string;
  additional_potential_option_2: string;
  additional_potential_option_3: string;
  equipment_level_increase: number;
  item_exceptional_option: ItemExceptionalOption;
  item_add_option: ItemAddOption;
  growth_exp: number;
  growth_level: number;
  scroll_upgrade: string;
  cuttable_count: string;
  golden_hammer_flag: string;
  scroll_resilience_count: string;
  scroll_upgradable_count: string;
  soul_name: string;
  soul_option: string;
  item_etc_option: ItemEctOption;
  starforce: string;
  starforce_scroll_flag: string;
  item_starforce_option: ItemStarforceOption;
  special_ring_level: number;
  date_expire: Date | null;
  freestyle_flag: string;
};

type ItemTotalOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
  boss_damage: string;
  ignore_monster_armor: string;
  all_stat: string;
  damage: string;
  equipment_level_decrease: number;
  max_hp_rate: string;
  max_mp_rate: string;
};

type ItemBaseOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
  boss_damage: string;
  ignore_monster_armor: string;
  all_stat: string;
  damage: string;
  equipment_level_decrease: number;
  max_hp_rate: string;
  max_mp_rate: string;
  base_equipment_level: number;
};

type ItemExceptionalOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  exceptional_upgrade: number;
};

type ItemAddOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
  boss_damage: string;
  ignore_monster_armor: string;
  all_stat: string;
  damage: string;
  equipment_level_decrease: number;
};

type ItemEctOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
};

type ItemStarforceOption = {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
};

type TitleData = {
  title_name: string;
  title_icon: string;
  title_description: string;
  date_expire: Date | null;
  date_option_expire: string;
  title_shape_name: string;
  title_shape_icon: string;
  title_shape_description: string;
};

type MedalShape = {
  medal_shape_name: string;
  medal_shape_icon: string;
  medal_shape_description: string;
  medal_shape_changed_name: string;
  medal_shape_changed_icon: string;
  medal_shape_changed_description: string;
};

export default function UserPage({ params }: Props) {
  const { characterName: urlCharacterName } = use(params);
  const characterName = decodeURI(urlCharacterName);

  const hash = useHash();
  const activeTab = useMemo(() => {
    return getValidTabId(hash);
  }, [hash]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [characterData, setCharacterData] = useState<CharacterWithRaw | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const characterData = await fetch(
          `/api/user?characterName=${characterName}`
        );
        const { data } = await characterData.json();

        setCharacterData(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생 했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [characterName]);

  console.log(characterData);

  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
      )}
      {!isLoading && error && <p>오류가 발생 했습니다.</p>}
      {!isLoading && error && !characterData && (
        <p>캐릭터를 찾을 수 없습니다.</p>
      )}
      {!isLoading && !error && characterData && (
        <>
          <div className="flex flex-col items-center w-[80%]">
            <div className="w-full bg-gray-500 rounded-lg p-3 py-0 bg-[url('/background.png')] bg-bottom">
              <div className="grid grid-cols-[3fr_4fr_3fr] gap-2">
                <div className="flex flex-col items-start justify-between pt-3 pb-3">
                  <div className="text-center bg-gray-400 text-white rounded-xl w-40 h-7 flex justify-center items-center galmuri text-sm">
                    <p>{characterData.character_class}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">유니온</p>
                      <p className="text-xs">
                        {characterData.raw_union.union_level}
                      </p>
                    </div>
                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">무릉도장</p>
                      <p className="text-xs">
                        {characterData.raw_dojang.date_dojang_record === null
                          ? "-"
                          : `${characterData.raw_dojang.dojang_best_floor}층`}
                      </p>
                    </div>
                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">인기도</p>
                      <p className="text-xs">
                        {characterData.character_popularity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-center bg-gray-400 text-white rounded-b-xl w-30 galmuri text-sm flex justify-center items-center">
                    <p className="text-gray-200">Lv.</p>
                    <p className="font-bold text-xs">
                      {characterData.character_level}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center overflow-hidden p-3">
                    {/* <Image
                    src={characterData.character_image ?? "/default.png"}
                    width={256}
                    height={256}
                    className="scale-[1.5] translate-y-10"
                    alt="Character Image"
                    unoptimized
                  /> */}
                    <CharacterAnimation
                      baseUrl={characterData.character_image}
                    />
                    <div className="text-center bg-sky-400 text-white rounded-xl w-40 flex justify-center items-center galmuri text-sm">
                      <p>{characterData.character_name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between pt-3 pb-3 p">
                  <div
                    className="text-center bg-gray-400 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm hover:bg-gray-500 hover:cursor-pointer"
                    onClick={() => {
                      const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        },
                      });
                      Toast.fire({
                        icon: "error",
                        title: "갱신은 10분에 1번만 가능합니다!",
                      });
                    }}
                  >
                    <p className="text-gray-200">갱신시간</p>
                    <p className="text-xs">{"1분 전"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">생성일</p>
                      <p className="text-xs">
                        {new Date(
                          characterData.character_date_create!
                        ).toLocaleDateString("ko-KR") ?? "-"}
                      </p>
                    </div>
                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">길드</p>
                      <p className="text-xs">
                        {characterData.character_guild_name ?? "-"}
                      </p>
                    </div>

                    <div className="text-center bg-gray-600/80 text-white rounded-xl w-40 flex justify-between items-center h-7 ps-3 pe-3 galmuri text-sm">
                      <p className="text-gray-200">연합</p>
                      <p className="text-xs">
                        {characterData.character_guild_name ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col mt-3 gap-1">
            <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-500 grid grid-cols-4 gap-2">
              {TABS.map((tab) => (
                <li key={tab.id} className="mb-2">
                  <a
                    href={`#${tab.id}`}
                    className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 galmuri text-sm ${
                      activeTab === tab.id
                        ? "text-white bg-orange-500"
                        : "bg-gray-50 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} />
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="w-full bg-white/70 rounded-lg p-4">
              {activeTab === "board" && <Board />}
              {activeTab === "details" && (
                <Details characterData={characterData} />
              )}
              {activeTab === "equipment" && (
                <Equipment characterData={characterData} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
