// src/app/api/user/route.ts

import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/apiResponses";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const EXPIRED_CHARACTER_DATA_MS = 15 * 24 * 60 * 60 * 1000;

const NEXON_API_KEY = env.NEXON_DEVELOPER_API_KEY;
const baseUrl = "https://open.api.nexon.com/maplestory/v1";
const headers = {
  accept: "application/json",
  "x-nxopen-api-key": NEXON_API_KEY,
};

// [Helper] BigInt를 JSON으로 보낼 수 있게 변환하는 함수
const serializeData = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

const getNexonAPI = async (characterName: string) => {
  const ocidRes = await fetch(`${baseUrl}/id?character_name=${characterName}`, {
    headers,
    cache: "no-store",
  });

  if (!ocidRes.ok) return serverErrorResponse("Invalid character name");

  const { ocid } = await ocidRes.json();

  const basicRes = await fetch(`${baseUrl}/character/basic?ocid=${ocid}`, {
    headers,
    cache: "no-store",
  });

  if (!basicRes.ok) return serverErrorResponse("Failed get character data");
  const basicData = await basicRes.json();
  // ... (기존 변수 할당 로직 동일)
  const characterNameData = basicData.character_name;
  const worldName = basicData.world_name;
  const characterClass = basicData.character_class;
  const characterLevel = parseInt(basicData.character_level, 10);
  const characterImage = basicData.character_image;
  const characterGender = basicData.character_gender;
  const characterClassLevel = basicData.character_class_level;
  const characterExp = basicData.character_exp.toString();
  const characterExpRate = parseFloat(basicData.character_exp_rate);
  const characterGuildName = basicData.character_guild_name;
  const characterDateCreate = basicData.character_date_create
    ? new Date(basicData.character_date_create)
    : null;
  const access_flag = basicData.access_flag === "true";
  const liberation_quest_clear = parseInt(basicData.liberation_quest_clear);

  // 인기도
  const popularityRes = await fetch(
    `${baseUrl}/character/popularity?ocid=${ocid}`,
    { headers, cache: "no-store" }
  );
  if (!popularityRes.ok) throw new Error("NEXON popularity API failed");
  const popularityData = await popularityRes.json();
  const character_popularity = parseInt(popularityData.popularity);

  // 스탯
  const statRes = await fetch(`${baseUrl}/character/stat?ocid=${ocid}`, {
    headers,
    cache: "no-store",
  });
  if (!statRes.ok) throw new Error("NEXON stat API failed");
  const statData = await statRes.json();

  // [수정 1] 콤마 제거 후 BigInt 변환 (여기서 에러 자주 발생함)
  const character_combat_power_ = statData.final_stat.find(
    (stat: { stat_name: string }) => stat.stat_name === "전투력"
  );
  const character_combat_power = character_combat_power_
    ? BigInt(character_combat_power_.stat_value.replace(/,/g, "")) // 콤마 제거
    : BigInt(0);

  // API Endpoint 목록
  const endpoints = [
    "stat",
    "hyper-stat",
    "propensity",
    "ability",
    "item-equipment",
    "cashitem-equipment",
    "symbol-equipment",
    "set-effect",
    "beauty-equipment",
    "android-equipment",
    "pet-equipment",
    "link-skill",
    "vmatrix",
    "hexamatrix",
    "hexamatrix-stat",
    "dojang",
    "other-stat",
    "ring-exchange-skill-equipment",
  ];

  const skillGrades = [
    "0",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "4",
    "hyperpassive",
    "hyperactive",
    "5",
    "6",
  ];
  const union_endpoints = [
    "union",
    "union-raider",
    "union-artifact",
    "union-champion",
  ];

  // [수정 2] 모든 fetch에 cache: "no-store" 추가
  const fetchPromises = endpoints.map((endpoint) =>
    fetch(`${baseUrl}/character/${endpoint}?ocid=${ocid}`, {
      headers,
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : { error: `Failed ${endpoint}` }))
      .catch((err) => ({ error: `Fetch error ${endpoint}` }))
  );

  const skillFetchPromises = skillGrades.map((grade) =>
    fetch(
      `${baseUrl}/character/skill?ocid=${ocid}&character_skill_grade=${grade}`,
      {
        headers,
        cache: "no-store",
      }
    )
      .then((res) => (res.ok ? res.json() : { error: `Failed skill ${grade}` }))
      .then((data) => ({ grade, data }))
      .catch((err) => ({ grade, data: { error: `Fetch error ${err}` } }))
  );

  const fetchUnionPromises = union_endpoints.map((endpoint) =>
    fetch(`${baseUrl}/user/${endpoint}?ocid=${ocid}`, {
      headers,
      cache: "no-store",
    })
      .then((res) =>
        res.ok ? res.json() : { error: `Failed union ${endpoint}` }
      )
      .catch((err) => ({ error: `Fetch union error ${endpoint}` }))
  );

  const resultsArray = await Promise.all(fetchPromises);
  const skillResultsArray = await Promise.all(skillFetchPromises);
  const unionResultArray = await Promise.all(fetchUnionPromises);

  const results: Record<string, unknown> = {};
  endpoints.forEach((endpoint, index) => {
    results[endpoint] = resultsArray[index];
  });

  const combinedSkillData: Record<string, unknown> = {};
  skillResultsArray.forEach((skillResult) => {
    combinedSkillData[skillResult.grade] = skillResult.data;
  });
  results["skill"] = combinedSkillData;

  union_endpoints.forEach((endpoint, index) => {
    results[endpoint] = unionResultArray[index];
  });

  // [수정 3] 오타 수정 (union-artifact) 및 Upsert 실행
  const characterData = await prisma.character.upsert({
    where: { ocid: ocid },
    update: {
      // ... (기존과 동일) ...
      status: "ACTIVE",
      character_image: characterImage,
      character_level: characterLevel,
      character_gender: characterGender,
      character_class: characterClass, // 직업 갱신
      character_class_level: characterClassLevel,
      character_exp: characterExp,
      character_exp_rate: characterExpRate,
      character_guild_name: characterGuildName,
      character_date_create: characterDateCreate,
      access_flag: access_flag,
      liberation_quest_clear: liberation_quest_clear,
      character_popularity: character_popularity,
      character_combat_power: character_combat_power,

      raw_stat: results["stat"] || {},
      raw_hyper_stat: results["hyper-stat"] || {},
      raw_propensity: results["propensity"] || {},
      raw_ability: results["ability"] || {},
      raw_item_equipment: results["item-equipment"] || {},
      raw_cashitem_equipment: results["cashitem-equipment"] || {},
      raw_symbol_equipment: results["symbol-equipment"] || {},
      raw_set_effect: results["set-effect"] || {},
      raw_beauty_equipment: results["beauty-equipment"] || {},
      raw_android_equipment: results["android-equipment"] || {},
      raw_pet_equipment: results["pet-equipment"] || {},
      raw_skill: results["skill"] || {},
      raw_link_skill: results["link-skill"] || {},
      raw_vmatrix: results["vmatrix"] || {},
      raw_hexamatrix: results["hexamatrix"] || {},
      raw_hexamatrix_stat: results["hexamatrix-stat"] || {},
      raw_dojang: results["dojang"] || {},
      raw_other_stat: results["other-stat"] || {},
      raw_ring_exchange_skill_equipment:
        results["ring-exchange-skill-equipment"] || {},

      raw_union: results["union"] || {},
      raw_union_raider: results["union-raider"] || {},
      raw_union_artifact: results["union-artifact"] || {}, // 오타 수정됨
      raw_union_champion: results["union-champion"] || {},

      lastFetchedAt: new Date(),
    },
    create: {
      // ... (create도 update와 동일하게 수정, 특히 artifact 오타 확인) ...
      character_name: characterNameData,
      world_name: worldName,
      character_class: characterClass,
      ocid: ocid,
      status: "ACTIVE",
      character_image: characterImage,
      character_level: characterLevel,
      character_gender: characterGender,
      character_class_level: characterClassLevel,
      character_exp: characterExp,
      character_exp_rate: characterExpRate,
      character_guild_name: characterGuildName,
      character_date_create: characterDateCreate,
      access_flag: access_flag,
      liberation_quest_clear: liberation_quest_clear,
      character_popularity: character_popularity,
      character_combat_power: character_combat_power,

      raw_stat: results["stat"] || {},
      raw_hyper_stat: results["hyper-stat"] || {},
      raw_propensity: results["propensity"] || {},
      raw_ability: results["ability"] || {},
      raw_item_equipment: results["item-equipment"] || {},
      raw_cashitem_equipment: results["cashitem-equipment"] || {},
      raw_symbol_equipment: results["symbol-equipment"] || {},
      raw_set_effect: results["set-effect"] || {},
      raw_beauty_equipment: results["beauty-equipment"] || {},
      raw_android_equipment: results["android-equipment"] || {},
      raw_pet_equipment: results["pet-equipment"] || {},
      raw_skill: results["skill"] || {},
      raw_link_skill: results["link-skill"] || {},
      raw_vmatrix: results["vmatrix"] || {},
      raw_hexamatrix: results["hexamatrix"] || {},
      raw_hexamatrix_stat: results["hexamatrix-stat"] || {},
      raw_dojang: results["dojang"] || {},
      raw_other_stat: results["other-stat"] || {},
      raw_ring_exchange_skill_equipment:
        results["ring-exchange-skill-equipment"] || {},

      raw_union: results["union"] || {},
      raw_union_raider: results["union-raider"] || {},
      raw_union_artifact: results["union-artifact"] || {},
      raw_union_champion: results["union-champion"] || {},

      lastFetchedAt: new Date(),
    },
  });

  // console.log(characterData); // BigInt 때문에 로그 찍을때도 에러 날 수 있으니 주의
  return characterData;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const characterNameParam = searchParams.get("characterName");
    const forceRefresh = searchParams.get("forceRefresh") === "true";

    console.log(`Request: ${characterNameParam}, Force: ${forceRefresh}`);

    if (!characterNameParam)
      return serverErrorResponse("Invalid character name");

    const characterName = decodeURI(characterNameParam);

    const characterData = await prisma.character.findFirst({
      where: { character_name: characterName },
    });

    let isForceFetch = false;

    if (characterData) {
      const nowMs = new Date().getTime();
      const lastFetchedAtMs = new Date(characterData.lastFetchedAt).getTime();
      const elapsedMs = nowMs - lastFetchedAtMs;

      if (elapsedMs >= EXPIRED_CHARACTER_DATA_MS) isForceFetch = true;
      if (forceRefresh) isForceFetch = true;
    }

    if (!characterData || isForceFetch) {
      console.log("Fetching new data from NEXON...");
      const newData = await getNexonAPI(characterName);
      revalidatePath(`/user/${characterName}`);
      // [수정 4] BigInt 직렬화 (serializeData 사용)
      return successResponse(serializeData({ data: newData }));
    }

    // 기존 데이터 반환 시에도 BigInt 직렬화
    return successResponse(serializeData({ data: characterData }));
  } catch (error) {
    console.error("API Error Details:", error);
    return badRequestResponse();
  }
}
