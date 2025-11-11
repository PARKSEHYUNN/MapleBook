// src/app/api/agree-terms/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (session.user.termsAgreed) {
      return NextResponse.json({ message: "Already agreed" }, { status: 200 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        termsAgreed: true,
        termsAgreedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("!!! API 라우트 에러 발생:", error);
    console.error("Error agreeing to terms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
