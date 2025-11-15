// src/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@prisma/client";
import { decrypt, maskApiKey } from "./lib/crypto";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 8,
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.termsAgreed = (user as User).termsAgreed;
        session.user.termsAgreedAt = (user as User).termsAgreedAt;

        session.user.mainCharacterId = (user as User).mainCharacterId;
        session.user.charactersLastFetchedAt = (
          user as User
        ).charactersLastFetchedAt;

        const encryptedKey = (user as User).encryptedApiKey;

        if (encryptedKey) {
          try {
            const decryptedKey = decrypt(encryptedKey);
            session.user.maskedApiKey = maskApiKey(decryptedKey);
          } catch (error) {
            console.error("API Key decryption failed for session:", error);
            session.user.maskedApiKey = "키 처리 오류";
          }
        }

        // const userWithMainCharacter = await prisma.user.findUnique({
        //   where: { id: user.id },
        //   include: {
        //     mainCharacter: true,
        //   },
        // });

        // if (userWithMainCharacter?.mainCharacter) {
        //   const char = userWithMainCharacter.mainCharacter;

        //   session.user.mainCharacter = {
        //     ...char,
        //     character_exp: char.character_exp?.toString() || null,
        //     character_combat_power:
        //       char.character_combat_power?.toString() || null,
        //   };
        // } else session.user.mainCharacter = null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        try {
          const headerMap = headers();
          const userAgent = (await headerMap).get("user-agent") || undefined;

          const ip =
            (await headerMap).get("x-forwarded-for") ??
            (await headerMap).get("cf-connecting-ip") ??
            "Unknown";

          let browserName: string | undefined;
          let osName: string | undefined;

          if (userAgent) {
            const { browser, os } = UAParser(userAgent);
            browserName = browser.name;
            osName = os.name;
          }

          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              ip: ip,
              userAgent: userAgent,
              browser: browserName,
              os: osName,
            },
          });
        } catch (error) {
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              userAgent: "Error parsing headers",
            },
          });
        }
      }
    },
  },
});
