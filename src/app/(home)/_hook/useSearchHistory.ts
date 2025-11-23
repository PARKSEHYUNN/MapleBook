// src/app/(home)/_hook/useSearchHistory.ts
import { useEffect, useState } from 'react';

type SearchItem = {
  name: string;
  date: string;
};

export default function useSearchHistory() {
  const [history, setHistory] = useState<SearchItem[]>([]);

  // 마운트시 1회 실행
  useEffect(() => {
    // 클라이언트 사이드 확인
    if (typeof window === 'undefined') {
      return;
    }

    const savedHistory = localStorage.getItem('searchHistory');

    if (savedHistory) {
      try {
        // Re-render 경고 무시
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('History parsing error', e);
      }
    }
  }, []);

  /**
   * 새로운 검색어 추가
   * @param keyword 검색어
   */
  const addHistory = (keyword: string) => {
    const newHistory = history.filter((item) => item.name !== keyword);
    const newItem = { name: keyword, date: new Date().toLocaleDateString() };
    newHistory.unshift(newItem);

    if (newHistory.length > 5) {
      newHistory.pop();
    }

    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  /**
   * 검색어 삭제
   * @param targetName 제거할 검색어
   */
  const removeHistory = (targetName: string) => {
    const newHistory = history.filter((item) => item.name !== targetName);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  /**
   * 검색어 초기화
   */
  const removeAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return { history, addHistory, removeHistory, removeAllHistory };
}
