// next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Character } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      termsAgreed: boolean;
      termsAgreedAt: Date | null;
      mainCharacter: Character | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    termsAgreed: boolean;
    termsAgreedAt: Date | null;
  }
}
