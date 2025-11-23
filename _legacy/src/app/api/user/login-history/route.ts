// src/app/api/user/login-history/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  unauthorizedResponse,
  serverErrorResponse,
  successResponse,
  badRequestResponse,
} from "@/lib/apiResponses";
import { NextRequest } from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
      return unauthorizedResponse();

    const userId = session.user.id;

    const { searchParams } = req.nextUrl;
    const pageParam = searchParams.get("page");

    let page = 1;
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) page = parsedPage;
      else return badRequestResponse("Invalid page number");
    }

    const skip = (page - 1) * PAGE_SIZE;
    const take = PAGE_SIZE;

    const [totalItems, loginHistories] = await prisma.$transaction([
      prisma.loginHistory.count({
        where: { userId: userId },
      }),
      prisma.loginHistory.findMany({
        where: { userId: userId },
        orderBy: {
          loginAt: "desc",
        },
        skip: skip,
        take: take,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const hasNextPage = page < totalPages;

    return successResponse({
      histories: loginHistories,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        hasNextPage,
        pageSize: PAGE_SIZE,
      },
    });
  } catch (error) {
    return serverErrorResponse("Internal Server Error");
  }
}
