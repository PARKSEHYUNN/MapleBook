// next-auth.d.ts

import "next-auth";
import { DefaultSession } from "next-auth";

import { Character } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      mainCharacter: Character | null;
    } & DefaultSession["user"];
  }
}
