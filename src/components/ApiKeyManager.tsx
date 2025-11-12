// src/components/ApiKeyManager.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

type ApiKeyManagerProps = {
  onKeyUpdated: () => void;
};

export default function ApiKeyManager({ onKeyUpdated }: ApiKeyManagerProps) {
  const { data: session, update } = useSession();

  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);

  const maskedApiKey = session?.user.maskedApiKey;

  const handleApiKey = async () => {
    setIsApiKeyLoading(true);

    const { value: apiKey } = await Swal.fire({
      title: "NEXON Open API Key 설정",
      input: "text",
      inputPlaceholder: "NEXON Open API Key 를 여기네 붙혀넣어주세요.",

      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소",

      customClass: {
        input: "swal-input",
        confirmButton: "btn btn-outline-orange me-2",
        cancelButton: "btn btn-outline-red",
      },
      buttonsStyling: false,
    });

    if (apiKey && typeof apiKey === "string") {
      Swal.fire({
        title: "저장 중...",
        text: "API 키를 검증하고 안전하게 암호화하여 저장하고 있습니다.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await fetch("/api/user/api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey }),
        });

        if (!res.ok) {
          let errorMessage = "서버에서 저장에 실패 했습니다.";

          try {
            const errorData = await res.json();
            if (errorData.error) errorMessage = errorData.error;
          } catch (jsonError) {
            console.error("Failed to parse error JSON response:", jsonError);
          }

          throw new Error(errorMessage);
        }

        await update();
        onKeyUpdated();

        Swal.fire({
          title: "저장 완료",
          text: "API 키가 안전하게 저장되었습니다.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "오류 발생",
          text:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
          icon: "error",
        });
      } finally {
        setIsApiKeyLoading(false);
      }
    } else setIsApiKeyLoading(false);
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-3">NEXON Open API Key 설정</h2>

      <div className="w-[60%] mx-auto">
        <div className="w-full">
          <label
            htmlFor="nexon-apikey"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            NEXON Open API Key
          </label>
          <div className="relative w-full">
            <input
              type="text"
              id="nexon-apikey"
              className="block bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="NEXON OPEN Api Key 가 등록되어 있지 않습니다."
              disabled
              value={maskedApiKey as string}
            />
            <button
              type="button"
              onClick={handleApiKey}
              disabled={isApiKeyLoading}
              className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-orange-500 border border-orange-500 bg-white rounded-e-lg border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-none focus:outline-none cursor-pointer disabled:opacity-50 disabled:text-orange-500 disabled:hover:bg-white disabled:cursor-default"
            >
              {isApiKeyLoading
                ? "처리 중..."
                : maskedApiKey
                ? "API 키 변경"
                : "API 키 등록"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
