// src/components/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import User from "./User";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainMenuRef.current &&
        !mainMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      )
        setIsMenuOpen(false);
    };

    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const activeLinkClasses =
    "block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500";
  const inavtiveLinkClasses =
    "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";

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
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 relative">
          <User />
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 foucs:outline-none foucs:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuButtonRef}
          >
            <span className="sr-only">Open main menu</span>
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            !isMenuOpen && "hidden"
          }`}
          ref={mainMenuRef}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href={"/user"}
                className={
                  pathname.startsWith("/user")
                    ? activeLinkClasses
                    : inavtiveLinkClasses
                }
                onClick={() => setIsMenuOpen(false)}
              >
                캐릭터 검색
              </Link>
            </li>
            <li>
              <Link
                href={"/guild"}
                className={
                  pathname.startsWith("/guild")
                    ? activeLinkClasses
                    : inavtiveLinkClasses
                }
                onClick={() => setIsMenuOpen(false)}
              >
                길드 검색
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
