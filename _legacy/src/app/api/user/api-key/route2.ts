// src/app/api/user/api-key/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Client } from "@upstash/qstash";

interface NexonCharacterBasic {
  ocid: string;
  character_name: string;
  world_name: string;
  character_class: string;
  character_level: number;
}

interface NexonAccount {
  account_id: string;
  character_list: NexonCharacterBasic[];
}

interface NexonCharacterListResponse {
  account_list: NexonAccount[];
}

const MIN_LEVEL_FOR_TRACKING = 250;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string")
      return NextResponse.json({ error: "Invalid API Key" }, { status: 400 });

    // API 키 검증
    const res = await fetch(
      "https://open.api.nexon.com/maplestory/v1/character/list",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-nxopen-api-key": apiKey,
        },
      }
    );
    if (!res.ok)
      return NextResponse.json(
        { error: "유효하지 않은 API 키 입니다." },
        { status: 409 }
      );

    const data = (await res.json()) as NexonCharacterListResponse;
    const characterData = data["account_list"].flatMap(
      (account) => account.character_list
    );

    const encryptedKey = encrypt(apiKey);

    const hashSecret = process.env.API_HASHING_SECRET;
    if (!hashSecret) throw new Error("API_HASHING_SECRET is not set");

    const apiKeyHash = createHmac("sha256", hashSecret)
      .update(apiKey)
      .digest("hex");

    const highLevelCharacters = characterData.filter(
      (char) => char.character_level >= MIN_LEVEL_FOR_TRACKING
    );

    // API 키 업데이트 및 캐릭터 추가
    const operations = [];

    operations.push(
      prisma.user.update({
        where: { id: userId },
        data: {
          encryptedApiKey: encryptedKey,
          apiKeyHash: apiKeyHash,
          charactersLastFetchedAt: new Date(),
        },
        select: { id: true },
      })
    );

    for (const char of highLevelCharacters) {
      const worldCheck =
        char.world_name === "리부트"
          ? "에오스"
          : char.world_name === "리부트2"
          ? "핼리오스"
          : char.world_name;

      operations.push(
        prisma.character.upsert({
          where: { ocid: char.ocid },
          update: {
            userId: userId,
            character_name: char.character_name,
            world_name: worldCheck,
            character_class: char.character_class,
            character_level: char.character_level,
          },
          create: {
            userId: userId,
            ocid: char.ocid,
            character_name: char.character_name,
            world_name: worldCheck,
            character_class: char.character_class,
            character_level: char.character_level,
          },
          select: { ocid: true },
        })
      );
    }

    await prisma.$transaction(operations);

    const qstashClient = new Client({
      baseUrl: process.env.QSTASH_URL!,
      token: process.env.QSTASH_TOKEN!,
    });

    let delayInSeconds = 1;
    for (const char of highLevelCharacters) {
      await qstashClient.publishJSON({
        url: `${process.env.APP_URL}/api/worker/process-character`,
        body: { ocid: char.ocid, userId: userId },
        delay: delayInSeconds,
      });
      delayInSeconds += 1;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "이 API 키는 이미 다른 계정에서 사용 중 입니다." },
          { status: 409 }
        );
      }
    }
    console.error("Error saving API Key", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
