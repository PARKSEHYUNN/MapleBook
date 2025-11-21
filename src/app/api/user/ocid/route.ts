// src/app/api/user/ocid/route.ts

import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/apiResponses";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const EXPIRED_CHARACTER_DATA_MS = 15 * 24 * 60 * 60 * 1000;

const NEXON_API_KEY = env.NEXON_DEVELOPER_API_KEY;
const baseUrl = "https://open.api.nexon.com/maplestory/v1";
const headers = {
  accept: "application/json",
  "x-nxopen-api-key": NEXON_API_KEY,
};

const getNexonAPI = async (ocid: string) => {
  const basicRes = await fetch(`${baseUrl}/character/basic?ocid=${ocid}`, {
    headers,
  });

  if (!basicRes.ok) return serverErrorResponse("Failed get character data");
  const basicData = await basicRes.json();
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

  // 인기도 정보 호출
  const popularityRes = await fetch(
    `${baseUrl}/character/popularity?ocid=${ocid}`,
    { headers }
  );
  if (!popularityRes.ok)
    throw new Error(`NEXON popularity API failed: ${popularityRes.statusText}`);

  const popularityData = await popularityRes.json();
  const character_popularity = parseInt(popularityData.popularity);

  // 스탯 정보 호출
  const statRes = await fetch(`${baseUrl}/character/stat?ocid=${ocid}`, {
    headers,
  });
  if (!statRes.ok)
    throw new Error(`NEXON stat API failed: ${popularityRes.statusText}`);

  const statData = await statRes.json();
  const character_combat_power_ = statData.final_stat.find(
    (stat: { stat_name: string }) => stat.stat_name === "전투력"
  );
  const character_combat_power = character_combat_power_
    ? BigInt(character_combat_power_.stat_value)
    : 0;

  // API 호출
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

  const fetchPromises = endpoints.map((endpoint) =>
    fetch(`${baseUrl}/character/${endpoint}?ocid=${ocid}`, { headers })
      .then((res) => (res.ok ? res.json() : { error: `Failed ${endpoint}` }))
      .catch((err) => ({ error: `Fetch error ${endpoint}` }))
  );

  const skillFetchPromises = skillGrades.map((grade) =>
    fetch(
      `${baseUrl}/character/skill?ocid=${ocid}&character_skill_grade=${grade}`,
      { headers }
    )
      .then((res) => (res.ok ? res.json() : { error: `Failed skill ${grade}` }))
      .then((data) => ({ grade, data }))
      .catch((err) => ({ grade, data: { error: `Fetch error ${err}` } }))
  );

  const fetchUnionPromises = union_endpoints.map((endpoint) =>
    fetch(`${baseUrl}/user/${endpoint}?ocid=${ocid}`, { headers })
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

  const characterData = await prisma.character.upsert({
    where: { ocid: ocid },
    update: {
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
      raw_union_artifact: results["union-artiface"] || {},
      raw_union_champion: results["union-champion"] || {},

      lastFetchedAt: new Date(),
    },
    create: {
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

  //console.log(characterData);

  return characterData;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const ocidParam = searchParams.get("ocid");

    if (!ocidParam) return serverErrorResponse("Invalid character ocid");

    const ocid = decodeURI(ocidParam);

    const characterData = await prisma.character.findUnique({
      where: { ocid: ocid },
    });

    let isForceFetch = false;

    if (characterData) {
      const nowMs = new Date().getTime();
      const lastFetchedAtMs = new Date(characterData?.lastFetchedAt);
      const elapsedMs = +nowMs - +lastFetchedAtMs;

      if (elapsedMs >= EXPIRED_CHARACTER_DATA_MS) isForceFetch = true;
    }

    if (!characterData || isForceFetch) {
      const newData = await getNexonAPI(ocid);
      return successResponse({ data: newData });
    }

    return successResponse({ data: characterData });
  } catch (error) {
    console.log(error);
    return badRequestResponse();
  }
}

/**
 * 1. ocid 확인
 * 1-1 ocid가 없는 경우 - badRequest 반환
 *
 * 2. ocid로 데이터베이스 데이터 확인
 * 2-1. 캐릭터 데이터가 데이터베이스에 없거나 캐릭터 데이터가 있지만 마지막 갱신 시간이 15일 이상인 경우 - 넥슨 API 에서 데이터 조회 및 db에 데이터 작성
 *
 * 3. DB또는 upsert 에서 받아온 정보를 successRequest 전송
 */
