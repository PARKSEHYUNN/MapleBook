// src/app/api/user/api-key/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Prisma } from "@prisma/client";

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

    const data = (await res.json()) as NexonCharacterListResponse;
    const characterData = data["account_list"].flatMap(
      (account) => account.character_list
    );

    console.log(characterData);

    const encryptedKey = encrypt(apiKey);

    const hashSecret = process.env.API_HASHING_SECRET;
    if (!hashSecret) throw new Error("API_HASHING_SECRET is not set");

    const apiKeyHash = createHmac("sha256", hashSecret)
      .update(apiKey)
      .digest("hex");

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
      })
    );

    for (const char of characterData) {
      operations.push(
        prisma.character.upsert({
          where: { ocid: char.ocid },
          update: {
            userId: userId,
            character_name: char.character_name,
            world_name: char.world_name,
            character_class: char.character_class,
            character_level: char.character_level,
          },
          create: {
            userId: userId,
            ocid: char.ocid,
            character_name: char.character_name,
            world_name: char.world_name,
            character_class: char.character_class,
            character_level: char.character_level,
          },
        })
      );
    }

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
