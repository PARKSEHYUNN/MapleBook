// src/app/user/[characterName]/_components/CharacterDetails/contents.ts

export const MAIN_STATS = [
  { key: 'HP', subKey: 'AP 배분 HP' },
  { key: 'MP', subKey: 'AP 배분 MP' },
  { key: 'STR', subKey: 'AP 배분 STR' },
  { key: 'DEX', subKey: 'AP 배분 DEX' },
  { key: 'INT', subKey: 'AP 배분 INT' },
  { key: 'LUK', subKey: 'AP 배분 LUK' },
];

export const DETAIL_STATS = [
  { label: '데미지', key: '데미지', unit: '%' },
  { label: '최종 데미지', key: '최종 데미지', unit: '%' },
  { label: '보스 몬스터 데미지', key: '보스 몬스터 데미지', unit: '%' },
  { label: '방어율 무시', key: '방어율 무시', unit: '%' },
  { label: '밀반 몬스터 데미지', key: '밀반 몬스터 데미지', unit: '%' },
  { label: '공격력', key: '공격력' },
  { label: '크리티컬 확률', key: '크리티컬 확률', unit: '%', digits: 0 },
  { label: '마력', key: '마력' },
  { label: '크리티컬 데미지', key: '크리티컬 데미지', unit: '%' },
  { label: '재사용 대기시간 감소', key: 'cooldown_reduction' },
  { label: '버프 지속시간', key: '버프 지속시간', unit: '%', digits: 0 },
  { label: '재사용 대기시간 미적용', key: '재사용 대기시간 미적용', unit: '%' },
  { label: '속성 내성 무시', key: '속성 내성 무시', unit: '%' },
  { label: '상태이상 추가 데미지', key: '상태이상 추가 데미지', unit: '%' },
  {
    label: '소환수 지속시간 증가',
    key: '소환수 지속시간 증가',
    unit: '%',
    digits: 0,
  },
  { label: '무기 숙련도', key: '무기 숙련도', unit: '%', digits: 0 },
];

export const ETC_STATS = [
  { label: '메소 획득량', key: '메소 획득량', unit: '%', digits: 0 },
  { label: '스타포스', key: '스타포스', digits: 0 },
  { label: '아이템 드롭률', key: '아이템 드롭률', unit: '%', digits: 0 },
  { label: '아케인포스', key: '아케인포스', digits: 0 },
  { label: '추가 경험치 획득', key: '추가 경험치 획득', unit: '%', digits: 2 },
  { label: '어센틱포스', key: '어센틱포스', digits: 0 },
];

export const NEXT_ETC_STATS = [
  { label: '방어력', key: '방어력' },
  { label: '상태이상 내성', key: '상태이상 내성' },
  { label: '이동속도', key: '이동속도', unit: '%' },
  { label: '점프력', key: '점프력', unit: '%' },
  { label: '스탠스', key: '스탠스', unit: '%' },
  { label: '공격 속도', key: '공격 속도', unit: '단계' },
];

export const HYPER_STATS = [
  { key: 'STR', label: 'STR' },
  { key: 'DEX', label: 'DEX' },
  { key: 'INT', label: 'INT' },
  { key: 'LUK', label: 'LUK' },
  { key: 'HP', label: 'HP' },
  { key: 'MP', label: 'MP' },
  { key: 'DF/TF/PP', label: 'DF/TF/PP' },
  { key: '크리티컬 확률', label: '크리티컬 확률' },
  { key: '크리티컬 데미지', label: '크리 데미지' },
  { key: '방어율 무시', label: '방어율 무시' },
  { key: '데미지', label: '데미지' },
  { key: '보스 몬스터 공격 시 데미지 증가', label: '보스 데미지' },
  { key: '일반 몬스터 공격 시 데미지', label: '일반 데미지' },
  { key: '상태 이상 내성', label: '상태 이상 내성' },
  { key: '공격력/마력', label: '공격력 / 마력' },
  { key: '획득 경험치', label: '획득 경험치' },
  { key: '아케인포스', label: '아케인포스' },
];
