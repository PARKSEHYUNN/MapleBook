// src/app/api/agree-terms/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("--- /api/agree-terms POST 요청 시작 ---");

  try {
    console.log("세션 확인 시작 (await auth)...");
    const session = await auth();
    console.log("세션 확인 완료:", session?.user?.id);

    if (!session || !session.user || !session.user.id) {
      console.log("세션 없음. 401 반환");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (session.user.termsAgreed) {
      console.log("이미 동의함. 200 반환");
      return NextResponse.json({ message: "Already agreed" }, { status: 200 });
    }

    console.log("DB 업데이트 시작 (prisma.user.update)...");
    await prisma.user.update({
      where: { id: userId },
      data: {
        termsAgreed: true,
        termsAgreedAt: new Date(),
      },
    });
    console.log("DB 업데이트 완료.");

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
