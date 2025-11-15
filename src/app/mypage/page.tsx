// src/app/mypage/page.tsx

"use client";

import { useHash } from "@/hooks/useHash";
import { useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCode,
  faMagnifyingGlass,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import Profile from "@/components/mypage/Profile";
import NexonApiKey from "@/components/mypage/NexonApiKey";
import LoginHistory from "@/components/mypage/LoginHistory";

const TABS = [
  { id: "profile", label: "프로필", icon: faCircleUser },
  { id: "nexonapikey", label: "Nexon Open API 키 연동", icon: faCode },
  { id: "login", label: "로그인 기록", icon: faRightToBracket },
];

const getValidTabId = (hash: string) => {
  const tabId = hash.substring(1);
  const isValid = TABS.some((tab) => tab.id === tabId);
  return isValid ? tabId : TABS[0].id;
};

export default function MypagePage() {
  const { data: session, status, update } = useSession();

  const hash = useHash();
  const activeTab = useMemo(() => {
    return getValidTabId(hash);
  }, [hash]);

  return (
    <div className="flex w-full flex-col items-center justify-start p-5">
      <h1 className="mb-3 text-2xl font-bold">내 정보</h1>

      <div className="md:flex w-full md:gap-4">
        <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-500 md:w-1/4 mb-4 md:mb-0">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${
                  activeTab === tab.id
                    ? "text-white bg-orange-500"
                    : "bg-gray-50 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="p-6 bg-gray-50 text-medium text-gray-900 rounded-lg w-full md:w-3/4 text-center">
          {activeTab === "profile" && <Profile />}

          {activeTab === "nexonapikey" && <NexonApiKey />}

          {activeTab === "login" && <LoginHistory />}
        </div>
      </div>
    </div>
  );
}

// 추가 예정
// API 키 검증 (캐릭터 목록 확인 하면서)
// 캐릭터 목록 조회 시 ocid, 이름, 월드, 직업, 레벨 나옴 + 개발자 API 키로 이미지만 조회
