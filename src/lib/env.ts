// src/lib/env.ts

import { z } from "zod";

const envSchema = z.object({
  // NEXTAUTH URL
  NEXTAUTH_URL: z.string().url("유효한 NEXTAUTH_URL 이 필요합니다."),

  // NEXTAUTH 암호화 키
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET 이 필요합니다."),

  // API 양방향 암호화 키
  API_ENCRYPTION_SECRET: z
    .string()
    .min(1, "API_ENCRYPTION_SECRET 이 필요합니다."),

  // API 단방향 암호화 키
  API_HASHING_SECRET: z.string().min(1, "API_HASHING_SECRET 이 필요합니다."),

  // Supabase 데이터베이스 URL
  DATABASE_URL: z.string().url("유효한 DATABASE_URL 이 필요합니다."),

  // Supabase 데이터베이스 Direct URL
  DIRECT_URL: z.string().url("유효한 DIRECT_URL 이 필요합니다."),

  // Google OAuth ID 키
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID 가 없습니다."),

  // Google OAuth Secret 키
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET 이 없습니다."),

  // QStash URL
  QSTASH_URL: z.string().url("유효한 QSTASH_URL 이 필요합니다."),

  // QStash Token 키
  QSTASH_TOKEN: z.string().min(1, "QSTASH_TOKEN 이 필요합니다."),

  // QStash App URL
  APP_URL: z.string().url("유효한 APP_URL 이 필요합니다."),

  // NEXON Open API 키
  NEXON_DEVELOPER_API_KEY: z
    .string()
    .min(1, "NEXON_DEVELOPER_API_KEY 가 없습니다."),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "필수 환경 변수가 누락되었거나 형식이 잘못되었습니다.",
    parsedEnv.error.flatten().fieldErrors
  );

  if (process.env.NODE_ENV === "development")
    console.error(".env.local 파일을 확인하세요.");

  process.exit(1);
}

export const env = parsedEnv.data;
