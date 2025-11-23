// src/app/(home)/_components/SearchWithHistory.tsx

'use client';

import useSearchHistory from '../_hook/useSearchHistory';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchWithHistory() {
  const [characterName, setCharacterName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const { history, addHistory, removeHistory, removeAllHistory } =
    useSearchHistory();

  // 캐릭터 검색 핸들러
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      return;
    } // 캐릭터 이름 빈 값 방지
    addHistory(keyword); // 검색기록에 추가

    setIsFocused(false);
    router.push(`/user/${keyword}`);
  };

  // 검색창 엔터 핸들러
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 키가 엔터일때 작동
    if (e.key === 'Enter') {
      handleSearch(characterName);
    }
  };

  return (
    <div className="relative w-full md:w-[60%]">
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
      </div>

      <input
        type="text"
        className="text-heading placeholder:text-body mx-auto block w-full rounded-full border border-gray-300 bg-white/50 px-4 py-3.5 ps-10 text-base shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-900/30 dark:text-white"
        placeholder="캐릭터 검색"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        onKeyUp={handleEnter}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
      />

      <div className="absolute inset-y-0 end-0 flex items-center pe-3">
        <button
          className="btn btn-outline-orange rounded-full py-1"
          onClick={() => handleSearch(characterName)}
        >
          검색
        </button>
      </div>

      {isFocused && history.length > 0 && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
            <span>최근 검색어</span>
            <button
              onClick={() => {
                removeAllHistory();
              }}
              className="underline hover:cursor-pointer hover:text-gray-700"
            >
              전체 삭제
            </button>
          </div>

          <ul>
            {history.map((item, index) => (
              <li
                key={index}
                className="group flex cursor-pointer items-center justify-between px-6 py-0.5 hover:bg-gray-100"
                onClick={() => {
                  setCharacterName(item.name);
                  handleSearch(item.name);
                }}
              >
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">{item.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHistory(item.name);
                  }}
                  className="p-1 text-xs text-red-500 underline hover:cursor-pointer hover:text-red-700"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
