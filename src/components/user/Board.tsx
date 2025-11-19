// src/components/user/Board.tsx

"use client";

import { useSession } from "next-auth/react";
import WorldIcon from "../WorldIcon";
import { useEffect, useState } from "react";
import { Character } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import BoardComment from "../BoardComment";

const TEMP_BOARD_DATA = [
  {
    id: 1,
    ocid: "a44264cf05e9ef072e1ae5980d87f014",
    comment: "이게 무야",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 360000000)),
  },
  {
    id: 1,
    ocid: "e0a4f439e53c369866b55297d2f5f4eb",
    comment: "ㄹㅇㅋㅋ",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 360000000)),
  },
  {
    id: 1,
    ocid: "680d384652a012930ba4cc54e3729d88",
    comment: "아니 이런 어머같은",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 360000000)),
  },
  {
    id: 1,
    ocid: "eab72bf204e897110df9d3507faea2f0",
    comment: "어머",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 360000000)),
  },
  {
    id: 1,
    ocid: "d7ccd2d4fd0b20376c35ba1cf5a1ae8f",
    comment: "나가요라",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 360000000)),
  },
];

type CharacterData = {
  ocid: string;
  characterName: string;
  characterImage: string;
  worldName: string;
  characterLevel: number;
};

export default function Board() {
  const { data: session, status } = useSession();
  const [boardData, setBoardData] = useState(
    [...TEMP_BOARD_DATA].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  );
  const [characterDataMap, setCharacterDataMap] = useState<
    Map<string, CharacterData>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uniqueOcidList = Array.from(
      new Set(TEMP_BOARD_DATA.map((item) => item.ocid))
    );

    const fetchCharacterData = async (ocid: string) => {
      const res = await fetch(`/api/user/ocid?ocid=${ocid}`);

      if (!res.ok) return null;

      const { data } = await res.json();

      console.log(data);

      return {
        ocid,
        characterName: data.character_name,
        characterImage: data.character_image,
        worldName: data.world_name,
        characterLevel: data.character_level,
      };
    };

    const fetchAllCharacters = async () => {
      setIsLoading(true);

      try {
        const results = await Promise.all(
          uniqueOcidList.map(fetchCharacterData)
        );

        const newMap = new Map<string, CharacterData>();
        results.forEach((data) => {
          if (data) newMap.set(data.ocid, data);
        });

        setCharacterDataMap(newMap);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  return (
    <div>
      <div className="w-full">
        <div className="border-b border-gray-300 pb-3 mb-3">
          <textarea
            className="w-full p-3 resize-none rounded-lg border border-gray-300 shadow-xs focus:outline-hidden galmuri text-sm"
            rows={4}
            placeholder={
              status === "authenticated"
                ? "리코다요 님 에게 방명록을 남겨 보세요!"
                : "로그인 후 방명록을 남겨 보세요!"
            }
            disabled={status === "authenticated" ? false : true}
          ></textarea>
          <div className="flex justify-end">
            <button
              className="btn btn-outline-orange px-3 py-1 galmuri text-sm"
              disabled={status === "authenticated" ? false : true}
            >
              작성
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
          )}

          {!isLoading && (
            <div className="w-full flex flex-col gap-3">
              {boardData.map((item, index) => {
                const charInfo = characterDataMap.get(item.ocid);
                const characterName = charInfo
                  ? charInfo.characterName
                  : "로딩 중...";

                return (
                  <BoardComment
                    key={index}
                    characterData={charInfo}
                    comment={item.comment}
                    createdAt={item.createdAt}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
