// src/components/User.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import WorldIcon from "./WorldIcon";
import { CustomCharacter } from "../../next-auth";

export default function User({
  signOut,
  character,
}: {
  signOut: () => void;
  character: CustomCharacter;
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      )
        setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div ref={userMenuRef}>
      <button
        type="button"
        className="w-8 h-8 flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 overflow-hidden"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <span className="sr-only">Open user menu</span>
        <Image
          src={character.character_image}
          alt="Character Image"
          width={32}
          height={32}
          className="rounded-full scale-[3.5] translate-x-0.5 translate-y-0 bg-white"
          unoptimized={true}
        />
      </button>
      <div
        className={`z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 absolute top-12 right-0 min-w-35  ${
          !isUserMenuOpen && "hidden"
        }`}
      >
        <div className="px-4 py-2">
          <span className="block text-sm text-gray-900 dark:text-white">
            {character.character_name}
          </span>
          <div className="flex gap-1 items-center">
            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
              <WorldIcon worldName={character.world_name} />
            </span>
            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
              {character.world_name}
            </span>
          </div>
          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
            Lv. {character.character_level} [{character.character_exp_rate}%]
          </span>
          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
            {character.character_class} / {character.character_class_level}차
          </span>
        </div>
        <ul className="py-2">
          <li>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              내 정보
            </Link>
          </li>
          <li>
            <Link
              href="/setting"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              설정
            </Link>
          </li>
        </ul>
        <ul className="py-2">
          <li>
            <Link
              href="/"
              onClick={() => signOut()}
              className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-300 dark:hover:text-white"
            >
              로그아웃
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
