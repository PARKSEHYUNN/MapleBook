// src/components/Mypage/NexonApiKey.tsx

"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { UpdateSession } from "next-auth/react";
import Swal from "sweetalert2";
import { Character } from "@prisma/client";
import CharacterCard from "../CharacterCard";

type NexonApiKeyProp = {
  session: Session | null;
  update: UpdateSession;
};

type CharacterInfo = Pick<
  Character,
  | "ocid"
  | "character_name"
  | "world_name"
  | "character_class"
  | "character_level"
  | "character_image"
>;

export default function NexonApiKey({ session, update }: NexonApiKeyProp) {
  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);
  const [characterList, setCharacterList] = useState<CharacterInfo[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [selectedOcid, setSelectedOcid] = useState<string | null>(
    session?.user?.mainCharacter?.ocid || null
  );

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoadingList(true);
      try {
        const res = await fetch("/api/user/characters");
        if (res.ok) {
          const data = await res.json();
          setCharacterList(data.characters);
        }
      } catch (error) {
        console.error("Failed to fetch characters", error);
      }
      setIsLoadingList(false);
    };
    fetchCharacters();
  }, []);

  useEffect(() => {
    if (session?.user.mainCharacter) {
      setSelectedOcid(session.user.mainCharacter.ocid);
    }
  }, [session?.user.mainCharacter]);

  const handleApiKey = async () => {
    setIsApiKeyLoading(true);

    const { value: apiKey } = await Swal.fire({
      title: "NEXON OPEN API Key 수정",
      input: "text",
      inputPlaceholder: "API 키를 여기에 붙혀넣으세요.",

      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소",

      customClass: {
        input:
          "bg-gray-50! border! border-gray-300! text-gray-900! text-sm! rounded-lg! block p-2.5!",
        confirmButton:
          "px-4 py-2 border border-blue-500 bg-transparent rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer me-2",
        cancelButton:
          "px-4 py-2 border border-red-500 bg-transparent rounded-lg text-red-500 hover:bg-red-500 hover:text-white cursor-pointer",
      },
      buttonsStyling: false,
    });

    if (apiKey && typeof apiKey === "string") {
      Swal.fire({
        title: "저장 중...",
        text: "API 키를 안전하게 암호화하여 저장하고 있습니다.",
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

        if (!res.ok) throw new Error("서버에서 저장에 실패했습니다.");

        await update();

        Swal.fire({
          title: "저장 완료!",
          text: "API 키가 안전하게 등록되었습니다.",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "오류 발생",
          text: "API 키 저장 중 문제가 발생했습니다.",
          icon: "error",
        });
      } finally {
        setIsApiKeyLoading(false);
      }
    }
  };

  const handleSelectCharacter = async (ocid: string) => {
    if (selectedOcid === ocid) return;

    setSelectedOcid(ocid);
  };

  const maskedApiKey = session?.user.maskedApiKey;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Nexon Open API 키 연동</h2>
      <div className="w-[60%] mx-auto">
        <div className="w-full">
          <label
            htmlFor="apikey"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            API 키 등록
          </label>
          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="NEXON OPEN API Key가 등록되어 있지 않습니다."
              required
              disabled
              value={maskedApiKey as string}
            />
            <button
              type="submit"
              onClick={handleApiKey}
              disabled={isApiKeyLoading}
              className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-orange-500 bg-white rounded-e-lg border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-none focus:outline-none cursor-pointer disabled:opacity-50 disabled:text-orange-500 disabled:hover:bg-white disabled:cursor-default"
            >
              {isApiKeyLoading
                ? "처리 중..."
                : maskedApiKey
                ? "API 키 변경"
                : "API 키 등록"}
            </button>
          </div>
        </div>

        <div className="w-full mt-5 pt-5 border-t border-gray-300">
          <label
            htmlFor="apikey"
            className="block mb-2 text-sm font-medium text-gray-900 text-start"
          >
            대표 캐릭터 선택
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {characterList.map((char) => (
              <CharacterCard
                key={char.ocid}
                character={char}
                isSelected={selectedOcid === char.ocid}
                onClick={handleSelectCharacter}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
