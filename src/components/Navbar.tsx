// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href={"/"} className="flex items-center space-x-3">
          <Image
            src={"/logo.svg"}
            alt="MapleBook Logo"
            width={32}
            height={32}
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            MapleBook
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
          {/* 사용자 프로필 버튼 */}
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
          >
            <span className="sr-only">Open user menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
