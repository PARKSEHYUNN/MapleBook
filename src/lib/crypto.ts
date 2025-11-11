// src/lib/crypto.ts

import crypto from "crypto";

const ENCRYPTION_KEY = process.env.API_ENCRYPTION_SECRET;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "API_ENCRYPTION_SECRET 환경 변수가 64자리 16진수 문자열로 설정되어야 합니다."
  );
}

const key = Buffer.from(ENCRYPTION_KEY, "hex");

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string) {
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 3)
      throw new Error("암호화된 텍스트의 형식이 잘못되었습니다.");

    const [ivHex, authTagHex, encryptedDataHex] = parts;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedDataHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("API 키 복호화 실패:", error);
    throw new Error(
      "데이터 복호화에 실패했습니다. 키가 정확하지 않거나 데이터가 변조되었을 수 있습니다."
    );
  }
}

export function maskApiKey(key: string): string {
  if (!key) return "";
  const prefix = key.slice(0, 4);
  const suffix = key.slice(-4);

  return `${prefix}****************${suffix}`;
}
