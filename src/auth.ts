// src/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@prisma/client";

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

        const userWithMainCharacter = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            mainCharacter: true,
          },
        });

        session.user.mainCharacter =
          userWithMainCharacter?.mainCharacter || null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
