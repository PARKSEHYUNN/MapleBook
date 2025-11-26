import { prisma } from '../config/db';
import { env } from '../config/env';
import { StatData } from '@/types/Character';
import { Prisma } from '@prisma/client';

const NEXON_API_KEY = env.NEXON_DEVELOPER_API_KEY;
const BASE_URL = 'https://open.api.nexon.com/maplestory/v1';
const headers = {
  accept: 'application/json',
  'x-nxopen-api-key': NEXON_API_KEY,
};

const API_ENDPOINTS = [
  'stat',
  'hyper-stat',
  'propensity',
  'ability',
  'item-equipment',
  'cashitem-equipment',
  'symbol-equipment',
  'set-effect',
  'beauty-equipment',
  'android-equipment',
  'pet-equipment',
  'link-skill',
  'vmatrix',
  'hexamatrix',
  'hexamatrix-stat',
  'dojang',
  'other-stat',
  'ring-exchange-skill-equipment',
];

const API_SKILL_GRADE = [
  '0',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '4',
  'hyperpassive',
  'hyperactive',
  '5',
  '6',
];

const API_UNION_ENDPOINTS = [
  'union',
  'union-raider',
  'union-artifact',
  'union-champion',
];

const REFRESH_COOLDOWN_MS = 5 * 60 * 1000;

const fetchSafe = async (url: string, headers: Record<string, string>) => {
  try {
    const res = await fetch(url, { headers, cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch (e) {
    console.error(`Fetch Error: ${url}`, e);
    return null;
  }
};

export async function fetchAndSaveCharacter(name: string) {
  // DB 갱신 시간 확인
  const character = await prisma.character.findFirst({
    where: { character_name: name },
  });
  const lastFetchedAt = character?.lastFetchedAt;

  if (lastFetchedAt) {
    // 현재 시간과 비교
    const nowMs = new Date().getTime();
    const lastFetchedAtMs = new Date(lastFetchedAt).getTime();
    const diffMs = nowMs - lastFetchedAtMs;

    // 쿨타임이 지나지 않았으면
    if (diffMs < REFRESH_COOLDOWN_MS) {
      throw new Error(
        `COOLDOWN_ACTIVE:${Math.ceil((REFRESH_COOLDOWN_MS - diffMs) / 1000)}`
      );
    }
  }

  const ocidRes = await fetch(`${BASE_URL}/id?character_name=${name}`, {
    headers,
  });
  if (!ocidRes.ok) {
    throw new Error('UNDEFINED_CHARACTER');
  }
  const { ocid } = await ocidRes.json();

  // 기본 정보
  const basicPromise = fetchSafe(
    `${BASE_URL}/character/basic?ocid=${ocid}`,
    headers
  );
  const popularityPromise = fetchSafe(
    `${BASE_URL}/character/popularity?ocid=${ocid}`,
    headers
  );
  const statPromise = fetchSafe(
    `${BASE_URL}/character/stat?ocid=${ocid}`,
    headers
  );

  // 콜드 데이터 정보
  const generalPromises = API_ENDPOINTS.map((endpoint) =>
    fetchSafe(`${BASE_URL}/character/${endpoint}?ocid=${ocid}`, headers).then(
      (data) => ({ key: `raw_${endpoint.replaceAll('-', '_')}`, data })
    )
  );

  // 스킬 정보
  const skillPromises = API_SKILL_GRADE.map((grade) =>
    fetchSafe(
      `${BASE_URL}/character/skill?ocid=${ocid}&character_skill_grade=${grade}`,
      headers
    ).then((data) => ({ grade, data }))
  );

  // 유니온 정보
  const unionPromises = API_UNION_ENDPOINTS.map((endpoint) =>
    fetchSafe(`${BASE_URL}/user/${endpoint}?ocid=${ocid}`, headers).then(
      (data) => ({ key: `raw_${endpoint.replaceAll('-', '_')}`, data })
    )
  );

  const [
    basicData,
    popularityData,
    statData,
    generalResults,
    skillResults,
    unionResults,
  ] = await Promise.all([
    basicPromise,
    popularityPromise,
    statPromise,
    Promise.all(generalPromises),
    Promise.all(skillPromises),
    Promise.all(unionPromises),
  ]);

  // 기본 데이터 검증
  if (!basicData) {
    throw new Error('UNDEFINED_BASIC_DATA');
  }

  // 전투력 추출
  const combatPowerObj = statData?.final_stat?.find(
    (s: StatData) => s.stat_name === '전투력'
  );
  const character_combat_power = combatPowerObj
    ? parseInt(combatPowerObj.stat_value.replace(/,/g, ''))
    : 0;

  // 스킬 데이터 병합
  const combinedSkillData: Record<string, unknown> = {};
  skillResults.forEach(({ grade, data }) => {
    if (data) {
      combinedSkillData[grade] = data;
    }
  });

  // 최종 결과 병합
  const resultObj: Record<string, unknown> = {
    character_name: basicData.character_name,
    world_name: basicData.world_name,
    character_gender: basicData.character_gender,
    character_class: basicData.character_class,
    character_class_level: basicData.character_class_level,
    character_level: basicData.character_level,
    character_exp: basicData.character_exp,
    character_exp_rate: parseFloat(basicData.character_exp_rate),
    character_guild_name: basicData.character_guild_name,
    character_image: basicData.character_image,
    character_date_create: new Date(basicData.character_date_create),
    access_flag: basicData.access_flag === 'true',
    liberation_quest_clear: parseInt(basicData.liberation_quest_clear, 10),

    character_popularity: popularityData.popularity ?? 0,
    character_combat_power,

    raw_skill: combinedSkillData,
  };

  // 콜드 데이터 병합
  generalResults.forEach(({ key, data }) => {
    resultObj[key] = data ?? {};
  });

  // 유니온 데이터 병합
  unionResults.forEach(({ key, data }) => {
    resultObj[key] = data ?? {};
  });

  const characterData = {
    ocid: ocid,
    status: 'ACTIVE',
    lastFetchedAt: new Date(),
    ...resultObj,
  } as Prisma.CharacterCreateInput;

  const savedData = await prisma.character.upsert({
    where: { ocid: ocid },
    update: characterData,
    create: characterData,
  });

  return savedData;
}
