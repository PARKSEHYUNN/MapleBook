// src/app/api/user/api-key/route.ts

import { auth } from "@/auth";
import { env } from "@/lib/env";
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/apiResponses";
import { encrypt } from "@/lib/crypto";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { Client } from "@upstash/qstash";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string")
      return badRequestResponse("Invalid API Key");

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

    if (!res.ok) return badRequestResponse("Invalid API Key");

    const data = (await res.json()) as NexonCharacterListResponse;
    const characterData = data["account_list"].flatMap(
      (account) => account.character_list
    );

    const encryptedKey = encrypt(apiKey);
    const hashKey = createHmac("sha256", env.API_HASHING_SECRET)
      .update(apiKey)
      .digest("hex");

    const highLevelCharacters = characterData.filter(
      (char) => char.character_level >= MIN_LEVEL_FOR_TRACKING
    );

    const operations = [];

    operations.push(
      prisma.user.update({
        where: { id: userId },
        data: {
          encryptedApiKey: encryptedKey,
          apiKeyHash: hashKey,
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
            status: "PENDING",
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
      baseUrl: env.QSTASH_URL,
      token: env.QSTASH_TOKEN,
    });

    await qstashClient.publishJSON({
      url: `${env.APP_URL}/api/worker/enqueue-character-updates`,
      body: { userId: userId },
      delay: 1,
    });

    return successResponse({});
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return badRequestResponse("Duplicate API Key");
    }

    return serverErrorResponse();
  }
}
