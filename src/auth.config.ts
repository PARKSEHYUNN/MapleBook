// src/auth.config.ts

import type { NextAuthConfig } from "next-auth";
import * as bcrypt from "bcrypt-ts";
import Credentials from "next-auth/providers/credentials";
import { CustomCharacter } from "../next-auth";

const tempUserData = [
  {
    id: "1",
    name: "Admin",
    email: "parksehyun2024@gmail.com",
    password: "$2b$10$vRm5rwFulfB5e1JLHAo9huPuwqz2IBOQZKPyc9riwF0Yzs95tj1Fu",
    character: {
      character_name: "잇츠미다람쥐",
      world_name: "스카니아",
      character_class: "팔라딘",
      character_class_level: "6",
      character_level: 263,
      character_exp_rate: "82.940",
      character_image:
        "https://avatar.maplestory.nexon.com/Character/180/JGACNDNMKFHCHHKFHNPLDGKBIIBGLNJEANEHKHBENAMLIBPNEHDFEEDMBJFGBALEBBFNIDGDCDGCHLCHCEGILEAKKKHIKJOEHECLOBIFBIMDKFBKMFBHGPPBPCMEBHHCLBHAGEODLLNEBBGDJFINLMEKIOLCKEOAHLMHKKFGMBGALHGEOIEKKAAKNDOICKJNMMILIPGMCGKOAHLOGIHAIAFIAHLACDEMGKEOHFCOENKLFFJGJDMFEBBPLFPIAHPO.png",
    },
  },
  {
    id: "2",
    name: "Admin2",
    email: "parksehyun2025@gmail.com",
    password: "$2b$10$vRm5rwFulfB5e1JLHAo9huPuwqz2IBOQZKPyc9riwF0Yzs95tj1Fu",
    character: {
      character_name: "껀호",
      world_name: "스카니아",
      character_class: "팬텀",
      character_class_level: "6",
      character_level: 264,
      character_exp_rate: "89.594",
      character_image:
        "https://avatar.maplestory.nexon.com/Character/180/MCPPFDJCOEHFOJIELJLBEHJDFALDCLDPIAJCBOKNBNPNMBJEKHBDIDLEHGNLIKHCIDCPGFPJKPCGNHBEICJPKKPBIAKGFECFPKACJIMIEIHOAMEDJLOBCLDFOGOEKFHOGPOHCLFOCLJIGLPFFBIDHKDEPFHMFEOFAFAHMKMJBLLMKJBELBKKJFOKADCNKMIPEHABEKLHCJKACPIGEGPCGEKGMGDHFPPLCOEIGMODFINDIKNFGEBHGCKCBKCGNBBN.png",
    },
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
        for (const user of tempUserData) {
          if (credentials.email === user.email) {
            const isPasswordVaild = await bcrypt.compare(
              credentials.password as string,
              user.password
            );

            if (isPasswordVaild) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                character: user.character,
              };
            }

            break;
          }
        }

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.character = user.character;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.character = token.character as CustomCharacter;
      return session;
    },
  },
} satisfies NextAuthConfig;
