// src/auth.config.ts

import type { NextAuthConfig } from "next-auth";
import * as bcrypt from "bcrypt-ts";
import Credentials from "next-auth/providers/credentials";

const tempUserData = [
  {
    id: "1",
    name: "Admin",
    email: "parksehyun2024@gmail.com",
    password: "$2b$10$vRm5rwFulfB5e1JLHAo9huPuwqz2IBOQZKPyc9riwF0Yzs95tj1Fu",
  },
];

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        tempUserData.map(async (user) => {
          if (credentials.email === user.email) {
            const isPasswordVaild = await bcrypt.compare(
              user.password,
              credentials.password as string
            );

            if (isPasswordVaild) {
              return { id: user.id, name: user.name, email: user.email };
            }

            return null;
          }
        });

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
