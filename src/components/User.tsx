// src/components/User.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import WorldIcon from "./WorldIcon";
import { useSession, signOut } from "next-auth/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function User() {
  const { data: session, status } = useSession();

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

  const mainCharacter = session?.user.mainCharacter;

  return (
    <div ref={userMenuRef} className="flex items-center gap-2">
      <button
        type="button"
        className="w-8 h-8 flex text-sm bg-gray-100 rounded-full md:me-0 focus:ring-2 focus:ring-gray-300 overflow-hidden items-center justify-center border border-gray-300 cursor-pointer"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <span className="sr-only">Open user menu</span>
        {mainCharacter ? (
          <Image
            src={mainCharacter.character_image!}
            alt={mainCharacter.character_name}
            width={32}
            height={32}
            className="rounded-full scale-[5.5] translate-x-0.5 translate-y-0 bg-white"
            unoptimized={true}
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-gray-600 h-5 w-5" />
        )}
      </button>
      <div
        className={`z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm absolute top-12 right-0 min-w-35 ${
          !isUserMenuOpen && "hidden"
        }`}
      >
        <div className="px-4 py-2">
          <span className="block text-sm text-gray-900 whitespace-nowrap">
            {mainCharacter ? mainCharacter.character_name : "대표 캐릭터 없음"}
          </span>

          <div className="flex gap-1 items-center">
            <span className="block text-sm text-gray-500 truncate">
              {mainCharacter ? (
                <WorldIcon worldName={mainCharacter.world_name} />
              ) : (
                <WorldIcon worldName="default" />
              )}
            </span>
            <span className="block text-sm text-gray-500 truncate">
              {mainCharacter ? mainCharacter.world_name : "월드 없음"}
            </span>
          </div>

          <span className="block text-sm text-gray-500 truncate">
            {mainCharacter
              ? `Lv. ${mainCharacter.character_level} [${mainCharacter.character_exp_rate}%]`
              : ""}
          </span>

          <span className="block text-sm text-gray-500 truncate">
            {mainCharacter
              ? `${mainCharacter.character_class} / ${mainCharacter.character_class_level}차`
              : ""}
          </span>
        </div>

        <ul className="py-2">
          <li>
            <Link
              href="/mypage"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              내 정보
            </Link>
          </li>
          <li>
            <Link
              href="/setting"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              로그아웃
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
