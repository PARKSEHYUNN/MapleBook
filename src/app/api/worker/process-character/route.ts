// src/app/worker/process-character/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const NEXON_API_KEY = process.env.NEXON_DEVELOPER_API_KEY!;

const baseUrl = "https://open.api.nexon.com/maplestory/v1";
const headers = {
  accept: "application/json",
  "x-nxopen-api-key": NEXON_API_KEY,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  let ocid: string | null = null;

  try {
    const { ocid: charOcid, userId } = await req.json();
    ocid = charOcid;

    if (!ocid)
      return NextResponse.json({ error: "Missing OCID" }, { status: 400 });

    // 기본 정보 호출
    const basicRes = await fetch(`${baseUrl}/character/basic?ocid=${ocid}`, {
      headers,
    });

    if (!basicRes.ok) {
      await prisma.character.update({
        where: { ocid: ocid },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          success: true,
          ocid: ocid,
          status: "FAILED",
        },
        { status: 200 }
      );
    }

    const basicData = await basicRes.json();
    const characterLevel = parseInt(basicData.character_level, 10);
    const characterImage = basicData.character_image;
    const characterGender = basicData.character_gender;
    const characterClassLevel = basicData.character_class_level;
    const characterExp = BigInt(basicData.character_exp);
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
      throw new Error(
        `NEXON popularity API failed: ${popularityRes.statusText}`
      );

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
        .then((res) =>
          res.ok ? res.json() : { error: `Failed skill ${grade}` }
        )
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

    await prisma.character.update({
      where: { ocid: ocid },
      data: {
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

    return NextResponse.json({ success: true, ocid: ocid, status: "ACTIVE" });
  } catch (error: unknown) {
    if (ocid) {
      await prisma.character.update({
        where: { ocid: ocid },
        data: { status: "FAILED" },
      });
    }

    let errorMessage = "Failed to process character";
    if (error instanceof Error) errorMessage = error.message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
