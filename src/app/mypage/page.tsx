// src/app/mypage/page.tsx

"use client";

import { useHash } from "@/hooks/useHash";
import { useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCode,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/components/Spinner";

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
  const { data: session, status } = useSession();

  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  const hash = useHash();
  const activeTab = useMemo(() => {
    return getValidTabId(hash);
  }, [hash]);

  const agreedAt = session?.user?.termsAgreedAt;
  const formattedDate = agreedAt
    ? new Date(agreedAt).toLocaleDateString("ko-KR")
    : "아직 동의하지 않음";

  const handleWithdrawal = () => {
    setIsWithdrawLoading(true);

    Swal.fire({
      title: "정말로 탈퇴하시겠습니까?",
      html: `
        <div style="text-align: left; padding: 0 1rem;">
          <p>계정을 탈퇴하면 다음 정보가 <strong>영구적으로 삭제</strong>되며, 복구할 수 없습니다.</p>
          <ul style="list-style-position: inside; margin: 10px 0;">
            <li style="margin-left: 10px;">- 계정 정보 (이메일, 프로필)</li>
            <li style="margin-left: 10px;">- Google 소셜 로그인 연동 정보</li>
            <li style="margin-left: 10px;">- 연동된 NEXON Open API 키</li>
          </ul>

          <p style="font-weight: bold; margin-top: 15px;">[유지되는 정보 안내]</p>
          <ul style="list-style-position: inside; margin: 10px 0;">
            <li style="margin-left: 10px;">- 회원님이 등록한 <strong>캐릭터 정보</strong>는 삭제되지 않고, 검색 가능한 공용 데이터로 유지됩니다.</li>
            <li style="margin-left: 10px;">- 이용약관(제17조 4항)에 따라, 작성하신 <strong>방명록</strong> 등은 <strong>닉네임과 함께 유지</strong>됩니다.</li>
          </ul>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예, 위 내용을 확인했으며 탈퇴합니다.",
      cancelButtonText: "취소",
      customClass: {
        confirmButton:
          "text-red-500 bg-transparent text-red-500 border border-red-500 hover:text-white hover:bg-red-500 cursor-pointer px-4 py-2.5 rounded-lg me-2",
        cancelButton:
          "text-blue-500 bg-transparent text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500 cursor-pointer px-4 py-2.5 rounded-lg me-2",
      },
      buttonsStyling: false,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch("/api/withdraw", { method: "DELETE" });
            if (!res.ok) throw new Error("회원 탈퇴에 실패했습니다.");

            Swal.fire({
              title: "탈퇴 완료",
              text: "이용해주셔서 감사합니다.",
              icon: "success",
            }).then(() => {
              signOut();
            });
          } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
            setIsWithdrawLoading(false);
          }
        }
      })
      .then(() => {
        setIsWithdrawLoading(false);
      });
  };

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
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900">프로필</h2>
              <div className="w-[60%] mx-auto">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 text-start"
                  >
                    이메일
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="example@example.com"
                    required
                    disabled
                    value={session?.user.email as string}
                  />
                </div>

                <div className="w-full mt-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 text-start"
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="OOO"
                    required
                    disabled
                    value={session?.user.name as string}
                  />
                </div>

                <div className="w-full mt-4">
                  <label
                    htmlFor="terms"
                    className="block mb-2 text-sm font-medium text-gray-900 text-start"
                  >
                    약관 동의 및 개인정보처리방침 동의 날짜
                  </label>
                  <input
                    type="text"
                    id="terms"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="0000-00-00"
                    required
                    disabled
                    value={formattedDate}
                  />
                </div>

                <div className="w-full mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-start">
                    회원 탈퇴
                  </label>
                  <button
                    type="button"
                    onClick={handleWithdrawal}
                    disabled={isWithdrawLoading}
                    className="text-center p-2.5 rounded-lg w-full gap-2 text-red-500 bg-transparent border border-red-500 hover:text-white hover:bg-red-500 cursor-pointer ring-none disabled:opacity-50 disabled:text-red-500 disabled:hover:bg-transparent disabled:cursor-default"
                  >
                    {isWithdrawLoading ? "처리 중..." : "회원 탈퇴"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "nexonapikey" && (
            <div>
              <h2 className="text-xl font-bold mb-3">Nexon Open API 키 연동</h2>
              <p>Nexon API 키 연동 관련 콘텐츠가 여기에 표시됩니다.</p>
            </div>
          )}

          {activeTab === "login" && (
            <div>
              <h2 className="text-xl font-bold mb-3">로그인 기록</h2>
              <p>로그인 기록 콘텐츠가 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
