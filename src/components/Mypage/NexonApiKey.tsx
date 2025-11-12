// src/components/Mypage/NexonApiKey.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import { UpdateSession } from "next-auth/react";
import Swal from "sweetalert2";
import { Character } from "@prisma/client";
import CharacterCard from "../CharacterCard";
import WorldSelecter from "../WorldSelecter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
  | "status"
>;

export default function NexonApiKey({ session, update }: NexonApiKeyProp) {
  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);
  const [characterList, setCharacterList] = useState<CharacterInfo[]>([]);
  const [characterWorldList, setCharacterWorldList] = useState<string[]>([]);
  const [currentWorld, setCurrentWorld] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [selectedOcid, setSelectedOcid] = useState<string | null>(
    session?.user?.mainCharacter?.ocid || null
  );

  const [isMainCharLoading, setIsMainCharLoading] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCharacters = async (isPolling = false) => {
    console.log("polling");
    if (!isPolling) setIsLoadingList(true);
    try {
      const res = await fetch("/api/user/characters");
      if (res.ok) {
        const data = await res.json();
        setCharacterList(data.characters);

        if (!isPolling) {
          const worldArray: string[] = ["전체"];
          data.characters.map(
            (char: CharacterInfo) =>
              worldArray.indexOf(char.world_name) === -1 &&
              worldArray.push(char.world_name)
          );
          setCharacterWorldList(worldArray);
          setCurrentWorld(worldArray[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch characters", error);
    }
    if (!isPolling) setIsLoadingList(false);
  };

  useEffect(() => {
    fetchCharacters();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const hasPending = characterList.some((char) => char.status === "PENDING");

    if (hasPending && !pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        fetchCharacters(true);
      }, 5000);
    } else if (!hasPending && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [characterList]);

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
    if (isMainCharLoading) return;

    if (selectedOcid === ocid) setSelectedOcid(null);
    else setSelectedOcid(ocid);
  };

  const handleSetMainCharacter = async () => {
    if (!selectedOcid) return;

    setIsMainCharLoading(true);

    try {
      const res = await fetch("/api/user/main-character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ocid: selectedOcid }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "대표 캐릭터 설정에 실패했습니다.");
      }

      await update();

      Swal.fire({
        title: "변경 완료",
        text: "대표 캐릭터가 변경되었습니다.",
        icon: "success",
        timer: 1500,
        showCancelButton: false,
      });
    } catch (error: unknown) {
      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      if (error instanceof Error) errorMessage = error.message;

      Swal.fire("오류", errorMessage, "error");
    } finally {
      setIsMainCharLoading(false);
    }
  };

  const maskedApiKey = session?.user.maskedApiKey;

  const currentMainOcid = session?.user?.mainCharacter?.ocid;
  const showFloatingbutton =
    selectedOcid && selectedOcid !== currentMainOcid && !isLoadingList;

  const filteredList = characterList.filter((char) => {
    if (currentWorld === "전체" || currentWorld === "") return true;

    return char.world_name === currentWorld;
  });

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
          <h2 className="text-xl font-bold mb-3">대표 캐릭터 선택</h2>
        </div>
      </div>
      <div className="w-[80%] mx-auto">
        <WorldSelecter
          list={characterWorldList}
          selectedWorld={currentWorld || characterWorldList[0]}
          onSelectWorld={setCurrentWorld}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 grid-cols-2 mt-2">
          {filteredList.map((char) => (
            <CharacterCard
              key={char.ocid}
              character={char}
              isSelected={selectedOcid === char.ocid}
              onClick={handleSelectCharacter}
            />
          ))}
        </div>
      </div>

      {showFloatingbutton && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleSetMainCharacter}
            disabled={isMainCharLoading}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isMainCharLoading && <FontAwesomeIcon icon={faSpinner} spin />}
            {isMainCharLoading ? "설정 중..." : "대표 캐릭터 선택"}
          </button>
        </div>
      )}
    </div>
  );
}
