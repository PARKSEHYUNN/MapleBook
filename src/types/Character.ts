// src/types/Character.ts
import { Character } from '@prisma/client';

export type CharacterWithRaw = Omit<
  Character,
  | 'raw_stat'
  | 'raw_hyper_stat'
  | 'raw_propensity'
  | 'raw_ability'
  | 'raw_item_equipment'
  | 'raw_cashitem_equipment'
  | 'raw_symbol_equipment'
  | 'raw_set_effect'
  | 'raw_beauty_equipment'
  | 'raw_android_equipment'
  | 'raw_pet_equipment'
  | 'raw_skill'
  | 'raw_link_skill'
  | 'raw_vmatrix'
  | 'raw_hexamatrix'
  | 'raw_hexamatrix_stat'
  | 'raw_dojang'
  | 'raw_other_stat'
  | 'raw_ring_exchange_skill_equipment'
  | 'raw_union'
  | 'raw_union_raider'
  | 'raw_union_artifact'
  | 'raw_union_champion'
> & {
  raw_stat: RawStat;
  raw_hyper_stat: RawHyperStat;
  raw_propensity: RawPropensity;
  raw_ability: RawAbility;
  raw_item_equipment: RawItemEquipment;
  raw_cashitem_equipment: RawCashItemEquipment;
  raw_symbol_equipment: RawSymbolEquipment;
  raw_set_effect: RawSetEffect;
  raw_beauty_equipment: RawBeautyEquipment;
  raw_android_equipment: RawAndroidEquipment;
  raw_pet_equipment: RawPetEquipment;
  raw_skill: RawSkill;
  raw_link_skill: RawLinkSkill;
  raw_vmatrix: RawVMatrix;
  raw_hexamatrix: RawHexaMatrix;
  raw_hexamatrix_stat: RawHexaMatrixStat;
  raw_dojang: RawDojang;
  raw_other_stat: RawOtherStat;
  raw_ring_exchange_skill_equipment: RawRingExchangeSkillEquipment;
  raw_union: RawUnion;
  raw_union_raider: RawUnionRaider;
  raw_union_artifact: RawUnionArtifact;
  raw_union_champion: RawUnionChampion;
};

export type RawStat = {
  final_stat: StatData[];
  remain_ap: number;
};

export type StatData = {
  stat_name: string;
  stat_value: string;
};

export type RawHyperStat = {
  use_preset_no: string;
  use_available_hyper_stat: number;
  hyper_stat_preset_1: HyperStatPreset[];
  hyper_stat_preset_1_remain_point: number;
  hyper_stat_preset_2: HyperStatPreset[];
  hyper_stat_preset_2_remain_point: number;
  hyper_stat_preset_3: HyperStatPreset[];
  hyper_stat_preset_3_remain_point: number;
};

type HyperStatPreset = {
  stat_type: string;
  stat_point: number;
  stat_level: number;
  stat_increase: string;
};

export type RawPropensity = {
  charisma_level: number;
  sensibility_level: number;
  insight_level: number;
  willingness_level: number;
  handicraft_level: number;
  charm_level: number;
};

export type RawAbility = {
  ability_grade: string;
  ability_info: AbilityInfo[];
  remain_fame: number;
  preset_no: number;
  ability_preset_1: AbilityPreset;
  ability_preset_2: AbilityPreset;
  ability_preset_3: AbilityPreset;
};

type AbilityInfo = {
  ability_no: string;
  ability_grade: string;
  ability_value: string;
};

type AbilityPreset = {
  ability_preset_grade: string;
  ability_info: AbilityInfo[];
};

export type RawItemEquipment = {
  preset_no: number;
  item_equipment: ItemEquipmentData[];
  item_equipment_preset_1: ItemEquipmentData[];
  item_equipment_preset_2: ItemEquipmentData[];
  item_equipment_preset_3: ItemEquipmentData[];
  title: ItemEquipmentTitle;
  medal_shape: ItemEquipmentMedalShape;
  dragon_equipment: ItemEquipmentData[];
  mechanic_equipment: ItemEquipmentData[];
};

type ItemEquipmentData = {
  item_equipment_part: string;
  item_equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description: string;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender: string;
  item_total_option: ItemEquipmentTotalOption;
  item_base_option: ItemEquipmentBaseOption;
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
  item_exceptional_option: ItemEquipmentExceptionalOption;
  item_add_option: ItemEquipmentAddOption;
  growth_exp: number;
  growth_level: number;
  scroll_upgrade: string;
  cuttable_count: string;
  golden_hammer_flag: string;
  scroll_resilience_count: string;
  scroll_upgradable_count: string;
  soul_name: string;
  soul_option: string;
  item_etc_option: ItemEquipmentEtcNStarforceOption;
  starforce: string;
  starforce_scroll_flag: string;
  item_starforce_option: ItemEquipmentEtcNStarforceOption;
  special_ring_level: number;
  date_expire: string;
  freestyle_flag: string;
};

type ItemEquipmentTotalOption = {
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

type ItemEquipmentBaseOption = Omit<
  ItemEquipmentTotalOption,
  'equipment_level_decrease'
>;

type ItemEquipmentExceptionalOption = Omit<
  ItemEquipmentTotalOption,
  | 'armor'
  | 'speed'
  | 'jump'
  | 'boss_damage'
  | 'ignore_monster_armor'
  | 'all_stat'
  | 'damage'
  | 'equipment_level_decrease'
  | 'max_hp_rate'
  | 'max_mp_rate'
> & {
  exceptional_upgrade: number;
};

type ItemEquipmentAddOption = Omit<
  ItemEquipmentTotalOption,
  'ignore_monster_armor' | 'max_hp_rate' | 'max_mp_rate'
>;

type ItemEquipmentEtcNStarforceOption = Omit<
  ItemEquipmentTotalOption,
  | 'boss_damage'
  | 'ignore_monster_armor'
  | 'all_stat'
  | 'damage'
  | 'equipment_level_decrease'
  | 'max_hp_rate'
  | 'max_mp_rate'
>;

type ItemEquipmentTitle = {
  title_name: string;
  title_icon: string;
  title_description: string;
  date_expire: string;
  date_option_expire: string;
  title_shape_name: string;
  title_shape_icon: string;
  title_shape_description: string;
};

type ItemEquipmentMedalShape = {
  medal_shape_name: string;
  medal_shape_icon: string;
  medal_shape_description: string;
  medal_shape_changed_name: string;
  medal_shape_changed_icon: string;
  medal_shape_changed_description: string;
};

export type RawCashItemEquipment = {
  character_look_mode: string;
  preset_no: number;
  cash_item_equipment_base: CashItemEquipmentBase[];
  cash_item_equipment_preset_1: CashItemEquipmentBase[];
  cash_item_equipment_preset_2: CashItemEquipmentBase[];
  cash_item_equipment_preset_3: CashItemEquipmentBase[];
  additional_cash_item_equipment_base: CashItemEquipmentBase[];
  additional_cash_item_equipment_preset_1: CashItemEquipmentBase[];
  additional_cash_item_equipment_preset_2: CashItemEquipmentBase[];
  additional_cash_item_equipment_preset_3: CashItemEquipmentBase[];
};

type CashItemEquipmentBase = {
  cash_item_equipment_part: string;
  cash_item_equipment_slot: string;
  cash_item_name: string;
  cash_item_icon: string;
  cash_item_description: string;
  cash_item_option: CashItemEquipmentOption[];
  date_expire: string;
  date_option_expire: string;
  cash_item_label: string;
  cash_item_coloring_prism: CashItemEquipmentColoringPrism;
  item_gender: string;
  skill: string[];
  freestyle_flag: string;
};

type CashItemEquipmentOption = {
  option_type: string;
  option_value: string;
};

type CashItemEquipmentColoringPrism = {
  color_range: string;
  hue: number;
  saturation: number;
  value: number;
};

export type RawSymbolEquipment = {
  symbol: SymbolData[];
};

type SymbolData = {
  symbol_name: string;
  symbol_icon: string;
  symbol_description: string;
  symbol_force: string;
  symbol_level: number;
  symbol_str: string;
  symbol_dex: string;
  symbol_int: string;
  symbol_luk: string;
  symbol_hp: string;
  symbol_drop_rate: string;
  symbol_meso_rate: string;
  symbol_exp_rate: string;
  symbol_growth_count: number;
  symbol_require_growth_count: number;
};

export type RawSetEffect = {
  set_effect: SetEffectData[];
};

type SetEffectData = {
  set_name: string;
  total_set_count: number;
  set_effect_info: SetEffectInfo[];
  set_option_full: SetEffectInfo[];
};

type SetEffectInfo = {
  set_count: number;
  set_option: string;
};

export type RawBeautyEquipment = {
  character_hair: BeautyEquipmentHair;
  character_face: BeautyEquipmentFace;
  character_skin: BeautyEquipmentSkin;
  additional_character_hair: BeautyEquipmentHair;
  additional_character_face: BeautyEquipmentFace;
  additional_character_skin: BeautyEquipmentSkin;
};

type BeautyEquipmentHair = {
  hair_name: string;
  base_color: string;
  mix_color: string;
  mix_rate: string;
  freestyle_flag: string;
};

type BeautyEquipmentFace = {
  face_name: string;
  base_color: string;
  mix_color: string;
  mix_rate: string;
  freestyle_flag: string;
};

type BeautyEquipmentSkin = {
  skin_name: string;
  color_style: string;
  hue: number;
  saturation: number;
  brightness: number;
};

export type RawAndroidEquipment = AndroidData & {
  preset_no: number;
  android_preset_1: AndroidData;
  android_preset_2: AndroidData;
  android_preset_3: AndroidData;
};

type AndroidEquipmentCashItem = Omit<
  CashItemEquipmentBase,
  'item_gender' | 'skills'
> & {
  android_item_gender: string;
};

type AndroidData = {
  android_name: string;
  android_nickname: string;
  android_icon: string;
  android_description: string;
  android_hair: BeautyEquipmentHair;
  android_face: BeautyEquipmentFace;
  android_skin: BeautyEquipmentSkin;
  android_cash_item_equipment: AndroidEquipmentCashItem[];
  android_ear_sensor_clip_flag: string;
  android_gender: string;
  android_grade: string;
  android_non_humanoid_flag: string;
  android_shop_usable_flag: string;
};

export type RawPetEquipment = {
  pet_1_name: string;
  pet_1_nickname: string;
  pet_1_icon: string;
  pet_1_description: string;
  pet_1_equipment: PetEquipmentItem;
  pet_1_auto_skill: PetEquipmentAutoSkill;
  pet_1_pet_type: string;
  pet_1_skill: string[];
  pet_1_date_expire: string;
  pet_1_appearance: string;
  pet_1_appearance_icon: string;
  pet_2_name: string;
  pet_2_nickname: string;
  pet_2_icon: string;
  pet_2_description: string;
  pet_2_equipment: PetEquipmentItem;
  pet_2_auto_skill: PetEquipmentAutoSkill;
  pet_2_pet_type: string;
  pet_2_skill: string[];
  pet_2_date_expire: string;
  pet_2_appearance: string;
  pet_2_appearance_icon: string;
  pet_3_name: string;
  pet_3_nickname: string;
  pet_3_icon: string;
  pet_3_description: string;
  pet_3_equipment: PetEquipmentItem;
  pet_3_auto_skill: PetEquipmentAutoSkill;
  pet_3_pet_type: string;
  pet_3_skill: string[];
  pet_3_date_expire: string;
  pet_3_appearance: string;
  pet_3_appearance_icon: string;
};

type PetEquipmentItem = {
  item_name: string;
  item_icon: string;
  item_description: string;
  item_option: PetEquipmentItemOption[];
  scroll_upgrade: number;
  scroll_upgradable: number;
  item_shape: string;
  item_shape_icon: string;
};

type PetEquipmentItemOption = {
  option_type: string;
  option_value: string;
};

type PetEquipmentAutoSkill = {
  skill_1: string;
  skill_1_icon: string;
  skill_2: string;
  skill_2_icon: string;
};

export type RawSkill = {
  '0': SkillInfo;
  '1': SkillInfo;
  '2': SkillInfo;
  '3': SkillInfo;
  '4': SkillInfo;
  '5': SkillInfo;
  '6': SkillInfo;
  '1.5': SkillInfo;
  '2.5': SkillInfo;
  hyperactive: SkillInfo;
  hyperpassive: SkillInfo;
};

type SkillInfo = {
  character_skill: SkillData[];
};

type SkillData = {
  skill_name: string;
  skill_description: string;
  skill_level: string;
  skill_effect: string;
  skill_effect_next: string;
  skill_icon: string;
};

export type RawLinkSkill = {
  character_link_skill: LinkSkillData[];
  character_link_skill_preset_1: LinkSkillData[];
  character_link_skill_preset_2: LinkSkillData[];
  character_link_skill_preset_3: LinkSkillData[];
  character_owned_link_skill: LinkSkillData;
  character_owned_link_skill_preset_1: LinkSkillData;
  character_owned_link_skill_preset_2: LinkSkillData;
  character_owned_link_skill_preset_3: LinkSkillData;
};

type LinkSkillData = {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string;
  skill_effect_next: string;
  skill_icon: string;
};

export type RawVMatrix = {
  character_v_core_equipment: VAMtrixData[];
  character_v_matrix_remain_slot_upgrade_point: number;
};

type VAMtrixData = {
  slot_id: string;
  slot_level: number;
  v_core_name: string;
  v_core_type: string;
  v_core_level: number;
  v_core_skill_1: string;
  v_core_skill_2: string;
  v_core_skill_3: string;
};

export type RawHexaMatrix = {
  character_hexa_core_equipment: HexaMatrixCore[];
};

type HexaMatrixCore = {
  hexa_core_name: string;
  hexa_core_level: number;
  hexa_core_type: string;
  linked_skill: HexaMatrixLinkedSkill[];
};

type HexaMatrixLinkedSkill = {
  hexa_skill_id: string;
};

export type RawHexaMatrixStat = {
  character_hexa_stat_core: HexaMatrixStatCore[];
  character_hexa_stat_core_2: HexaMatrixStatCore[];
  character_hexa_stat_core_3: HexaMatrixStatCore[];
  preset_hexa_stat_core: HexaMatrixStatCore[];
  preset_hexa_stat_core_2: HexaMatrixStatCore[];
  preset_hexa_stat_core_3: HexaMatrixStatCore[];
};

type HexaMatrixStatCore = {
  slot_id: string;
  main_stat_name: string;
  sub_stat_name_1: string;
  sub_stat_name_2: string;
  main_stat_level: number;
  sub_stat_level_1: number;
  sub_stat_level_2: number;
  stat_grade: number;
};

export type RawDojang = {
  dojang_best_floor: number;
  date_dojang_record: string;
  dojang_best_time: number;
};

export type RawOtherStat = {
  other_stat: OtherStatData[];
};

type OtherStatData = {
  other_stat_type: string;
  stat_info: OtherStatInfo[];
};

type OtherStatInfo = {
  stat_name: string;
  stat_value: string;
};

export type RawRingExchangeSkillEquipment = {
  special_ring_exchange_name: string;
  special_ring_exchange_level: number;
  special_ring_exchange_icon: string;
  special_ring_exchange_description: string;
};

export type RawUnion = {
  union_level: number;
  union_grade: string;
  union_artifact_level: number;
  union_artifact_exp: number;
  union_artifact_point: number;
};

export type RawUnionRaider = UnionPreset & {
  use_preset_no: number;
  union_raider_preset_1: UnionPreset;
  union_raider_preset_2: UnionPreset;
  union_raider_preset_3: UnionPreset;
  union_raider_preset_4: UnionPreset;
  union_raider_preset_5: UnionPreset;
};

type UnionPreset = {
  union_raider_stat: string[];
  union_occupied_stat: string[];
  union_inner_stat: UnionRaiderInnerStat[];
  union_block: UnionRaiderBlock[];
};

type UnionRaiderInnerStat = {
  stat_field_id: string;
  stat_field_effect: string;
};

type UnionRaiderBlock = {
  block_type: string;
  block_class: string;
  block_level: string;
  block_control_point: UnionRaiderBlockControlPointAndPosition[];
  block_position: UnionRaiderBlockControlPointAndPosition[];
};

type UnionRaiderBlockControlPointAndPosition = {
  x: number;
  y: number;
};

export type RawUnionArtifact = {
  union_artifact_effect: UnionArtifactEffect[];
  union_artifact_crystal: UnionArtifactCrystal[];
  union_artifact_remain_ap: number;
};

type UnionArtifactEffect = {
  name: string;
  level: number;
};

type UnionArtifactCrystal = {
  name: string;
  validity_flag: string;
  date_expire: string;
  level: number;
  crystal_option_name_1: string;
  crystal_option_name_2: string;
  crystal_option_name_3: string;
};

export type RawUnionChampion = {
  union_chamipion: UnionChamipionData[];
  champion_badge_total_info: UnionChamipionBadgeInfo[];
};

type UnionChamipionData = {
  champion_name: string;
  champion_slot: number;
  champion_grade: string;
  champion_class: string;
  champion_badge_info: UnionChamipionBadgeInfo[];
};

type UnionChamipionBadgeInfo = {
  stat: string;
};
