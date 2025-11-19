// src/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";

import { auth } from "@/auth";
import AuthSessionProvider from "./AuthSessionProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

config.autoAddCss = false;

BigInt.prototype.toJSON = function () {
  return this.toString();
};

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

const galmuriFont = localFont({
  src: "./fonts/Galmuri14.woff2",
  display: "swap",
  variable: "--galmuri",
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
      <head>
        <script
          type="text/javascript"
          src="https://openapi.nexon.com/js/analytics.js?app_id=242165"
          async
        ></script>
      </head>
      <body
        className={`${pretendardFont.variable} ${galmuriFont.variable} antialiased flex flex-col min-h-screen bg-white bg-[url('/background.png')] bg-cover`} //
      >
        <AuthSessionProvider session={session}>
          <Navbar />
          <main className="flex-grow w-full md:w-[80%] mx-auto bg-white/50">
            {children}
          </main>
        </AuthSessionProvider>
        <Footer />
      </body>
    </html>
  );
}
