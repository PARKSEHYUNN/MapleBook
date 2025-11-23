// src/components/layout/Navbar/NavLogo.tsx
import Image from 'next/image';
import Link from 'next/link';

type NavLogoProps = {
  width: number;
  height: number;
};

export default function NavLogo({ width, height }: NavLogoProps) {
  return (
    <Link href="/" className="me-5 flex cursor-pointer items-center space-x-3">
      <Image
        src="/images/common/logo.svg"
        alt="Navbar Logo"
        width={width}
        height={height}
      />
      <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white">
        MapleBook
      </span>
    </Link>
  );
}
