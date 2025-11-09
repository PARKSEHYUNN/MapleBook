// src/auth.ts

import { AuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
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
        session.user.termsAgreed = user.termsAgreed;

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
};

export const auth = () => getServerSession(authOptions);
