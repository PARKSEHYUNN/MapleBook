// src/app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const errorMessages: { [key: string]: string } = {
  OAuthAccountNotLinked:
    "이 이메일은 다른 소셜 계정으로 가입되어 있습니다. 원래 사용했던 방식으로 로그인해 주세요.",
  Callback:
    "로그인 콜백 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  AccessDenied:
    "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  Default: "로그인 중 알 수 없는 오류가 발생했습니다.",
};

function ErrorMessage() {
  const searchParms = useSearchParams();
  const errorCode = searchParms.get("error");

  if (!errorCode) return null;

  const message = errorMessages[errorCode] || errorMessages.Default;

  return message;
}

export default function LoginPage() {
  const error = ErrorMessage();

  return (
    <div className="flex w-full flex-col items-center justify-start p-5">
      <h1 className="mb-3 text-2xl font-bold">로그인</h1>
      {error && (
        <span className="bg-red-600 text-white pt-2.5 pb-2.5 ps-5 pe-5 rounded-lg flex items-center mb-3 text-sm">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="sm"
            className="me-1"
          />
          {error}
        </span>
      )}
      <div className="mb-3">
        <button
          className="w-full text-gray-900 bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 border border-gray-300 flex cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image
            src={"/google.svg"}
            alt="Google Icon"
            width={16}
            height={16}
            className="me-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
