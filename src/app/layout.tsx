// src/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import "./globals.css";

import { auth } from "@/auth";
import AuthSessionProvider from "./AuthSessionProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const pretendardFont = localFont({
  src: [
    {
      path: "./fonts/PretendardVariable.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "MapleBook",
  description: "Search Maplestory Character",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ko">
      <body className={`${pretendardFont.variable} antialiased`}>
        <AuthSessionProvider session={session}>
          <Navbar />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
