// src/app/users/page.ts

"use client";

import Board from "@/components/user/Board";
import Details from "@/components/user/Details";
import WorldIcon from "@/components/WorldIcon";
import { useHash } from "@/hooks/useHash";
import {
  faAsterisk,
  faBookOpen,
  faChalkboard,
  faMagnifyingGlass,
  faShieldHalved,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Character } from "@prisma/client";
import Image from "next/image";
import { useState, use, useEffect, useMemo } from "react";

const TABS = [
  { id: "board", label: "방명록", icon: faChalkboard },
  { id: "details", label: "상세 정보", icon: faAsterisk },
  { id: "equipment", label: "장착 아이템", icon: faShieldHalved },
  { id: "skill", label: "스킬", icon: faBookOpen },
];

const getValidTabId = (hash: string) => {
  const tabId = hash.substring(1);
  const isValid = TABS.some((tab) => tab.id === tabId);
  return isValid ? tabId : TABS[0].id;
};

type Props = {
  params: Promise<{ characterName: string }>;
};

export default function UsersPage({ params }: Props) {
  const { characterName } = use(params);
  const parseCharacterName = decodeURI(characterName);
  const hash = useHash();
  const activeTab = useMemo(() => {
    return getValidTabId(hash);
  }, [hash]);

  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState<Character | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const characterData = await fetch(
          `/api/user?characterName=${parseCharacterName}`
        );
        const data = await characterData.json();

        setCharacterData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parseCharacterName]);

  console.log(characterData);
  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      {loading && <FontAwesomeIcon icon={faSpinner} spin />}
      {!loading && characterData && (
        <div className="flex flex-col items-center">
          <div className="w-[80%] bg-gray-500/70 rounded-lg p-4">
            <div className="grid grid-cols-[2fr_8fr] gap-2">
              <div>
                <div className="border border-gray-300 border-2 flex items-center justify-center w-full aspect-square p-2 rounded-lg">
                  <Image
                    src={characterData.character_image ?? "/default.png"}
                    width={128}
                    height={128}
                    className="scale-[2]"
                    alt="Character Image"
                  />
                </div>

                <div className="text-sm mt-2">
                  <p>캐릭터 생성일</p>
                  <p className="ms-1">
                    {new Date(
                      characterData.character_date_create!
                    ).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex flex-row items-end mb-1">
                  <p className="text-xl font-bold flex flex-row">
                    {characterData.character_name}
                  </p>
                  <span className="ms-1">
                    Lv. {characterData.character_level}
                  </span>
                </div>

                <div className="flex flex-row items-end mb-1">
                  <p className="text-sm flex flex-row bg-yellow-300 rounded-lg px-3">
                    {characterData.character_class}
                  </p>
                  <span className="ms-1 text-xs">
                    {characterData.character_class_level} 차
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-300 pb-3 mb-3">
                  <p className="text-sm">경험치</p>
                  <div className="w-full bg-neutral-quaternary rounded-full h-2.5 bg-gray-500 relative">
                    <div
                      className={`absolute top-0 left-0 bg-brand h-2.5 rounded-full bg-yellow-300`}
                      style={{
                        width: `${characterData.character_exp_rate?.toFixed(
                          0
                        )}%`,
                      }}
                    ></div>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold z-10">
                      {characterData.character_exp_rate}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm flex flex-col">
                    <div className="mb-2">
                      <span>월드</span>
                      <div className="flex flex-row items-center gap-1 p-1">
                        <div className="">
                          <WorldIcon worldName={characterData.world_name} />
                        </div>
                        <p>{characterData.world_name}</p>
                      </div>
                    </div>

                    <div className="bg-gray-500 text-white rounded-lg p-3 flex flex-col">
                      <span>인기도</span>
                      <span className="text-lg">
                        {characterData.character_popularity}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm flex flex-col">
                    <div className="mb-2">
                      <span>길드</span>
                      <div className="flex flex-row items-center gap-1 p-1">
                        <p>{characterData.character_guild_name ?? "없음"}</p>
                      </div>
                    </div>

                    <div className="bg-gray-500 text-white rounded-lg p-3 flex flex-col">
                      <span>전투력</span>
                      <span className="text-lg">
                        {characterData.character_combat_power
                          ?.toString()
                          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:flex md:grid md:grid-cols-[2fr_8fr] mt-3 gap-2">
            <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-500">
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

            <div className="bg-gray-50 text-medium text-gray-900 rounded-lg w-full p-2">
              {activeTab === "board" && <Board />}
              {activeTab === "details" && (
                <Details characterData={characterData} />
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !characterData && (
        <div>
          <p>캐릭터를 찾을 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}

/**
 * ## users 페이지
 * 1. 캐릭터 닉네임 확인
 * 1-1. 캐릭터 닉네임이 없는 경우 - / 로 라우터 푸시
 *
 * 2. 캐릭터 닉네임으로 캐릭터 정보 요청 GET 전송
 * 2-1. 캐릭터 정보가 없는 경우 - /error 로 라우터 푸시
 *
 * 3. 캐릭터 정보 표시
 */

/**
 * ## /api/user GET
 * 1. 캐릭터 닉네임 확인
 * 1-1. 캐릭터 닉네임 없는 경우 - badRequest 전송
 *
 * 2. 캐릭터 닉네임으로 데이터베이스 데이터 확인
 * 2-1. 캐릭터 데이터가 데이터베이스에 없거나 캐릭터 데이터가 있지만 마지막 갱신 시간이 15일 이상인 경우 - 넥슨 API 에서 데이터 조회 및 db에 데이터 작성
 *
 * 3. DB또는 upsert 에서 받아온 정보를 successRequest 전송
 */
