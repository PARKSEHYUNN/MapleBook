// src/app/api/user/characters/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const characters = await prisma.character.findMany({
      where: { userId: userId },
      select: {
        id: true,
        ocid: true,
        character_name: true,
        world_name: true,
        character_class: true,
        character_level: true,
        character_image: true,
        status: true,
      },
      orderBy: {
        character_level: "desc",
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        charactersLastFetchedAt: true,
      },
    });

    return NextResponse.json(
      {
        characters: characters,
        lastFetchedAt: user?.charactersLastFetchedAt || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching character list:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
