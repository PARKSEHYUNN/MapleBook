// drizzle.config.ts

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (
  !process.env.CLOUDFLARE_ACCOUNT_ID ||
  !process.env.CLOUDFLARE_DATABASE_ID ||
  !process.env.CLOUDFLARE_D1_TOKEN
) {
  throw new Error(
    "Cloudflare D1 환경변수(ACCOUNT_ID, DATABASE_ID, D1_TOKEN)가 설정되지 않았습니다."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_D1_TOKEN,
  },
});
