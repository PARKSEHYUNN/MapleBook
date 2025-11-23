// src/components/layout/Navbar/index.tsx

'use client';

import NavItem from './NavItem';
import NavLogo from './NavLogo';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // 메뉴가 열렸을때 메뉴 외부창 클릭 시 메뉴창 닫음
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
      <div className="relative mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-8 py-4">
        <div className="flex">
          {/* 네비 바 로고 */}
          <NavLogo width={32} height={32} />

          {/* 네비바 아이템 */}
          <div
            className={`absolute top-full left-0 z-10 w-full items-center justify-between bg-gray-50 md:static md:top-auto md:left-auto md:order-1 md:flex md:w-auto md:bg-transparent dark:bg-gray-700 md:dark:bg-transparent ${!isMenuOpen && 'hidden'}`}
            ref={menuRef}
          >
            <ul className="flex flex-col rounded-lg border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-4 md:border-0 md:p-0">
              <NavItem href="/ranking" label="랭킹" />
              <NavItem href="/guild" label="길드" />
              <NavItem href="/board" label="게시판" />
            </ul>
          </div>
        </div>

        {/* 네비바 왼쪽 영역 */}
        <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0">
          {/* 로그인 및 사용자 버튼 */}
          <Link href="/login" className="btn btn-orange">
            로그인
          </Link>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuButtonRef}
          >
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
        </div>
      </div>
    </nav>
  );
}
