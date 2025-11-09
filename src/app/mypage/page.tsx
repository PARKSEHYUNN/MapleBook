// src/app/mypage/page.tsx

"use client";

import { useHash } from "@/hooks/useHash";
import { useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCode,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

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
  const hash = useHash();
  const activeTab = useMemo(() => {
    return getValidTabId(hash);
  }, [hash]);

  return (
    <div className="flex w-full flex-col items-center justify-start p-5 dark:bg-gray-800">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">내 정보</h1>

      <div className="md:flex w-full md:gap-4">
        <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:w-1/4 mb-4 md:mb-0">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${
                  activeTab === tab.id
                    ? "text-white bg-orange-500 dark:bg-orange-600"
                    : "bg-gray-50 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="p-6 bg-gray-50 text-medium text-gray-900 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full md:w-3/4 text-center">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                프로필
              </h2>
              이메일 이름 회원탈퇴버튼
            </div>
          )}

          {activeTab === "nexonapikey" && (
            <div>
              <h2 className="text-xl font-bold mb-3 dark:text-white">
                Nexon Open API 키 연동
              </h2>
              <p>Nexon API 키 연동 관련 콘텐츠가 여기에 표시됩니다.</p>
            </div>
          )}

          {activeTab === "login" && (
            <div>
              <h2 className="text-xl font-bold mb-3 dark:text-white">
                로그인 기록
              </h2>
              <p>로그인 기록 콘텐츠가 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
