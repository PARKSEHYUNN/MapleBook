// src/app/api/user/characters/refresh/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/apiResponses";
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
      return unauthorizedResponse();

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { encryptedApiKey: true },
    });

    if (!user || !user.encryptedApiKey)
      return badRequestResponse("Invalid API Key");

    let decryptedKey: string;
    try {
      decryptedKey = decrypt(user.encryptedApiKey);
    } catch (error) {
      console.error("API Key decryption failed for user:", userId, error);
      return serverErrorResponse("Failed decryption API Key");
    }

    const res = await fetch(
      "https://open.api.nexon.com/maplestory/v1/character/list",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-nxopen-api-key": decryptedKey,
        },
      }
    );

    if (!res.ok) return badRequestResponse("Invalid API Key");

    const data = (await res.json()) as NexonCharacterListResponse;
    const characterData = data.account_list.flatMap(
      (account) => account.character_list
    );

    const highLevelCharacters = characterData.filter(
      (char) => char.character_level >= MIN_LEVEL_FOR_TRACKING
    );

    const operations = [];

    operations.push(
      prisma.user.update({
        where: { id: userId },
        data: { charactersLastFetchedAt: new Date() },
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
            world_name: char.world_name,
            character_class: char.character_class,
            character_level: char.character_level,
            status: "PENDING",
          },
          create: {
            userId: userId,
            ocid: char.ocid,
            character_name: char.character_name,
            world_name: char.world_name,
            character_class: char.character_class,
            character_level: char.character_level,
            status: "PENDING",
          },
          select: { ocid: true },
        })
      );
    }

    await prisma.$transaction(operations);

    if (highLevelCharacters.length > 0) {
      const qstashClient = new Client({
        baseUrl: env.QSTASH_URL,
        token: env.QSTASH_TOKEN,
      });

      await qstashClient.publishJSON({
        url: `${env.APP_URL}/api/worker/enqueue-character-updates`,
        body: { userId: userId },
        delay: 1,
      });
    }

    return successResponse({
      message: `Enqueued ${highLevelCharacters.length} characters for processing.`,
    });
  } catch (error) {
    console.error("Failed to refresh character list:", error);
    return serverErrorResponse("Internal Server Error");
  }
}
