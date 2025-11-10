// src/app/terms/page.tsx

"use client";

import { useState, useEffect, Fragment } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import ReactMarkdown from "react-markdown";

export default function TermsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/mypage";

  const [isLoading, setIsLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [termsMd, setTermsMd] = useState("");
  const [privacyMd, setPrivacyMd] = useState("");

  useEffect(() => {
    fetch("/terms.md")
      .then((res) => res.text())
      .then((text) => setTermsMd(text));

    fetch("/privacy.md")
      .then((res) => res.text())
      .then((text) => setPrivacyMd(text));
  }, []);

  const handleAgree = async () => {
    if (!isTermsChecked || !isPrivacyChecked) {
      alert("모든 필수 약관에 동의해야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/agree-terms", { method: "POST" });
      if (!res.ok) {
        console.error(res);
        throw new Error("약관 동의 처리에 실패했습니다.");
      }

      await update();

      router.push(callbackUrl);
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const closeModal = (type: "terms" | "privacy") => {
    if (type === "terms") setIsTermsModalOpen(false);
    if (type === "privacy") setIsPrivacyModalOpen(false);
  };

  const AgreementModal = ({
    isOpen,
    onClose,
    title,
    content,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
  }) => (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-4 h-[60vh] overflow-y-auto rounded-md border p-4">
                  <article className="prose max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </article>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    확인
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <div className="flex w-full flex-col items-center justify-start p-5">
      <h1 className="mb-3 text-2xl font-bold">약관 동의</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              서비스 이용약관 (필수)
            </label>
          </div>
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            자세히 보기
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              id="privacy"
              type="checkbox"
              checked={isPrivacyChecked}
              onChange={(e) => setIsPrivacyChecked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="privacy"
              className="ml-2 block text-sm text-gray-900"
            >
              개인정보처리방침 (필수)
            </label>
          </div>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            자세히 보기
          </button>
        </div>
      </div>

      <button
        onClick={handleAgree}
        disabled={!isTermsChecked || !isPrivacyChecked || isLoading}
        className="w-[50%] mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "처리 중..." : "모두 동의하고 계속하기"}
      </button>

      <AgreementModal
        isOpen={isTermsModalOpen}
        onClose={() => closeModal("terms")}
        title="서비스 이용약관"
        content={termsMd}
      />
      <AgreementModal
        isOpen={isPrivacyModalOpen}
        onClose={() => closeModal("privacy")}
        title="개인정보처리방침"
        content={privacyMd}
      />
    </div>
  );
}
