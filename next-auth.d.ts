// next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Character } from "@prisma/client";

type JsonSafeCharacter = Omit<
  Character,
  "character_exp" | "character_combat_power"
> & {
  character_exp: string | null;
  character_combat_power: string | null;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      termsAgreed: boolean;
      termsAgreedAt: Date | null;
      mainCharacterId: string | null;
      maskedApiKey: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    termsAgreed: boolean;
    termsAgreedAt: Date | null;
    encryptedApiKey: string | null;
  }
}
