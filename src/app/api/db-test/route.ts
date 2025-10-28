// src/app/api/db-test/route.ts

import { NextResponse } from "next/server";
import { createDbClient } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  context: { params: {}; env: { DB: D1Database } }
) {
  try {
    const db = createDbClient(context.env.DB);
    const testEmail = `test-${Date.now()}@example.com`;

    const insertedUser = await db
      .insert(users)
      .values({
        name: "Test User",
        email: testEmail,
        hashedPassword: "test_password",
        createdAt: new Date(),
      })
      .returning()
      .get();

    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .get();

    return NextResponse.json({
      message: "D1 DB Read/Write Test Successful!",
      inserted: insertedUser,
      found: foundUser,
    });
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("DB Test Failed:", error);
    return NextResponse.json(
      {
        message: "DB Test Failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
