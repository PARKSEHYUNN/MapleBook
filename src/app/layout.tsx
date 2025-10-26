import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import localFont from "next/font/local";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${maplestoryFont.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
