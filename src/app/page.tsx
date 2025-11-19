// src/app/page.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  const [characterName, setCharacterName] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!!characterName.trim()) router.push(`/user/${characterName}`);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      <h1 className="mb-3 text-4xl font-bold flex flex-row items-center gap-2">
        <Image src="/logo.svg" width={64} height={64} alt="Main Logo" />
        MapleBook
      </h1>

      <div className="relative w-[60%]">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
        </div>

        <input
          type="text"
          id="visitors"
          className="bg-white border border-gray-300 text-heading text-base rounded-[100px] block w-full mx-auto px-4 py-3.5 shadow-xs placeholder:text-body ps-10 focus:outline-none focus:ring-1"
          placeholder="캐릭터 검색"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          onKeyUp={handleEnter}
          required
        />

        <div className="absolute inset-y-0 end-0 flex items-center pe-3">
          <button
            className="btn btn-outline-orange rounded-3xl py-1"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
      </div>

      <div className="w-[70%] border-t border-gray-300 mt-5 pt-5">
        <div className="text-center rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left text-body rounded-lg table-fixed border-separate border-spacing-y-2">
            <thead className="text-sm text-body bg-ornage-100 border-b rounded-lg border-gray-300">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-center"
                  colSpan={5}
                >
                  검색 기록
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr className="mb-1">
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
              </tr>
              <tr className="mb-1">
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
              </tr>
              <tr className="mb-1">
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
                <td className="relative">
                  조금길어지면
                  <button className="absolute">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[70%] grid grid-cols-2 gap-5 mt-5 pt-5 border-t border-gray-300">
        <div className="w-full flex flex-col items-center justify-center">
          <span className="w-full mb-1">전투력 랭킹</span>

          <div className="text-center rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-body rounded-lg">
              <thead className="text-sm text-body bg-orange-100 border-b rounded-lg border-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    랭킹
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    이름
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    레벨
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    직업
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    전투력
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    className="bg-white border-b border-gray-300 hover:bg-gray-50 cursor-pointer text-xs"
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      {i <= 3 && (
                        <FontAwesomeIcon
                          icon={faCrown}
                          className={
                            i === 1
                              ? "text-yellow-500"
                              : i === 2
                              ? "text-gray-500"
                              : "text-yellow-700"
                          }
                        />
                      )}

                      {i > 3 && i}
                    </th>
                    <td className="px-6 py-4">리코다요</td>
                    <td className="px-6 py-4">272</td>
                    <td className="px-6 py-4">렌</td>
                    <td className="px-6 py-4 whitespace-nowrap">20,440,904</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <span className="w-full">검색어 랭킹</span>

          <div className="text-center rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-body rounded-lg">
              <thead className="text-sm text-body bg-orange-100 border-b rounded-lg border-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    랭킹
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    이름
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    레벨
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    직업
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    검색 수
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    className="bg-white border-b border-gray-300 hover:bg-gray-50 cursor-pointer text-xs"
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      {i <= 3 && (
                        <FontAwesomeIcon
                          icon={faCrown}
                          className={
                            i === 1
                              ? "text-yellow-500"
                              : i === 2
                              ? "text-gray-500"
                              : "text-yellow-700"
                          }
                        />
                      )}

                      {i > 3 && i}
                    </th>
                    <td className="px-6 py-4">리코다요</td>
                    <td className="px-6 py-4">272</td>
                    <td className="px-6 py-4">렌</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parseInt((2000 / (i * i)).toString())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
