// src/app/user/main-character/route.ts

import { auth } from "@/auth";
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/apiResponses";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return unauthorizedResponse();

    const mainCharacterId = session.user.mainCharacterId;

    if (!mainCharacterId) return successResponse({ character: null });

    const character = await prisma.character.findUnique({
      where: { id: mainCharacterId },
    });

    if (!character) return notFoundResponse("Character Id is undefined");

    const safeCharacter = {
      ...character,
      character_exp: character.character_exp?.toString() || null,
      character_combat_power:
        character.character_combat_power?.toString() || null,
    };

    return successResponse({ character: safeCharacter });
  } catch (error) {
    console.error("Failed to fetch main character:", error);
    return serverErrorResponse("Internal Server Error");
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { ocid } = await req.json();

    if (!ocid)
      return NextResponse.json({ error: "Missing OCID" }, { status: 400 });

    const character = await prisma.character.findFirst({
      where: {
        ocid: ocid,
        userId: userId,
      },
    });

    if (!character)
      return NextResponse.json(
        { error: "Character not found or does not belong to user" },
        { status: 404 }
      );

    if (character.status !== "ACTIVE")
      return NextResponse.json(
        { error: "Character is not active (still pending or failed)" },
        { status: 400 }
      );

    await prisma.user.update({
      where: { id: userId },
      data: {
        mainCharacterId: character.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to set main character:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
