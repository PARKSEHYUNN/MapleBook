// next-auth.d.ts

import { NextAuthRequest } from "next-auth";
import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

interface CustomCharacter {
  character_name: string;
  world_name: string;
  character_class: string;
  character_class_level: string;
  character_level: number;
  character_exp_rate: string;
  character_image: string;
}

declare module "next/server" {
  interface NextRequest {
    auth: import("next-auth").Session | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      character: CustomCharacter;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    character: CustomCharacter;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    character: CustomCharacter;
  }
}
