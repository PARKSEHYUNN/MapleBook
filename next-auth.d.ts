// next-auth.d.ts

import "next-auth";
import { DefaultSession } from "next-auth";

import { Character } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      termsAgreed: boolean;
      mainCharacter: Character | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    termsAgreed: boolean;
  }
}
