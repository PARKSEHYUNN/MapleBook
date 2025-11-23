// src/app/api/worker/enqueue-character-updates/route.ts

import { prisma } from "@/lib/prisma";
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/apiResponses";
import { Client } from "@upstash/qstash";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  let userId: string | null = null;

  try {
    const { userId: id } = await req.json();
    userId = id;

    if (!userId) return badRequestResponse("Missing userId");

    const pendingCharacters = await prisma.character.findMany({
      where: { userId: userId, status: "PENDING" },
      select: {
        ocid: true,
      },
    });

    if (pendingCharacters.length === 0)
      return successResponse({ message: "No pending characters to process." });

    const qstashClient = new Client({
      baseUrl: env.QSTASH_URL,
      token: env.QSTASH_TOKEN,
    });

    const publishPromises = [];
    let delayInSeconds = 1;

    for (const char of pendingCharacters) {
      publishPromises.push(
        qstashClient.publishJSON({
          url: `${env.APP_URL}/api/worker/process-character`,
          body: { ocid: char.ocid, userId: userId },
          delay: delayInSeconds,
        })
      );
      delayInSeconds += 1;
    }

    await Promise.all(publishPromises);

    return successResponse({
      message: `Enqueued ${pendingCharacters.length} character for processing.`,
    });
  } catch (error: unknown) {
    let errorMessage = "Failed to enqueue character updates";
    if (error instanceof Error) errorMessage = error.message;

    console.error(`[EnqueueWorker] Error for userId ${userId}:`, errorMessage);

    return serverErrorResponse(errorMessage || "");
  }
}
