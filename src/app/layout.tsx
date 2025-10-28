import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import localFont from "next/font/local";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Providers } from "./providers";

config.autoAddCss = false;

const maplestoryFont = localFont({
  src: [
    {
      path: "./fonts/Maplestory-Light.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Maplestory-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-maplestory",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MapleBook",
  description: "Search Maplestory Character",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="bg-white dark:bg-gray-900 select-none">
      <body className={`${maplestoryFont.className} antialiased`}>
        <Providers>
          <Navbar />
          <div className="flex justify-center">
            <div className="w-[100vw] text-center md:w-[80vw]">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
