// src/api/user/login-manager/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  unauthorizedResponse,
  serverErrorResponse,
  successResponse,
  badRequestResponse,
} from "@/lib/apiResponses";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return unauthorizedResponse();

    const userId = session.user.id;

    const sessions = await prisma.session.findMany({
      where: { userId: userId, expires: { gt: new Date() } },
    });

    return successResponse({
      sessions: sessions,
    });
  } catch (error) {
    return serverErrorResponse("Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return unauthorizedResponse();

    const userId = session.user.id;

    const { searchParams } = req.nextUrl;
    const sessionTokenParam = searchParams.get("token");

    let token = "";
    if (sessionTokenParam) {
      if (!sessionTokenParam || sessionTokenParam === "")
        return badRequestResponse("Invalid token");

      token = sessionTokenParam;
    }

    const deleteSessionCheck = await prisma.session.findUnique({
      where: { userId: userId, sessionToken: token },
    });

    if (!deleteSessionCheck) return badRequestResponse("Invalid session");

    await prisma.session.delete({
      where: { userId: userId, sessionToken: token },
    });

    return successResponse({});
  } catch (error) {
    serverErrorResponse("Internal Server Error");
  }
}
