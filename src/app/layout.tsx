// src/app/layout.tsx
import './globals.css';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Loader } from '@/components/ui/Loader';
import AlertListener from '@/providers/AlterListener';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

config.autoAddCss = false;

const pretendardFont = localFont({
  src: [
    {
      path: './fonts/PretendardVariable.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});

const galmuriFont = localFont({
  src: './fonts/Galmuri14.woff2',
  display: 'swap',
  variable: '--galmuri',
});

const nexonLv1Font = localFont({
  src: [
    {
      path: './fonts/NEXONLv1GothicLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/NEXONLv1GothicRegular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/NEXONLv1GothicBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--nexon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MapleBook',
  description: 'Search Maplestory Character',
  icons: {
    icon: '/images/common/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendardFont.variable} ${galmuriFont.variable} ${nexonLv1Font.variable} flex min-h-screen flex-col antialiased`}
      >
        <div className='fixed inset-0 -z-10 bg-[url("/images/common/background.png")] bg-cover bg-center bg-no-repeat dark:bg-[url("/images/common/background-dark.png")]'></div>
        <Navbar />
        <main className="mx-auto w-full flex-grow bg-white/80 md:my-5 md:w-[80%] md:rounded-2xl dark:bg-gray-500/60">
          <Loader />
          <AlertListener />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
