// src/components/LoginHistoryComponents.tsx

import { useCallback, useEffect, useState } from "react";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  visiblePages = 5
) => {
  let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let end = Math.min(totalPages, start + visiblePages - 1);

  start = Math.max(1, end - visiblePages + 1);

  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

interface LoginHistory {
  id: string;
  loginAt: string;
  ip: string | null;
  browser: string | null;
  os: string | null;
  userAgent: string | null;
}

interface Pageination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
}

export default function LoginHistoryComponents() {
  const [histories, setHistories] = useState<LoginHistory[]>([]);
  const [pagination, setPagination] = useState<Pageination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/user/login-history?page=${page}`);
      if (!res.ok) {
        throw new Error("로그인 기록을 불러오는데 실패 했습니다.");
      }

      const data = await res.json();
      setHistories(data.histories);
      setPagination(data.pagination);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생 했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, fetchHistory]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      (pagination && newPage > pagination.totalPages) ||
      newPage === currentPage
    )
      return;
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (isLoading && !pagination) return <div className="h-9"></div>;
    if (error || !pagination || pagination.totalPages === 0)
      return <div className="h-9"></div>;

    const { totalPages, currentPage } = pagination;
    const pageNumbers = getPaginationRange(currentPage, totalPages, 5);

    const showLeftEllipsis = pageNumbers[0] > 1;
    const showRightEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

    const buttonClass =
      "w-9 h-9 flex justify-center items-center rounded-lg cursor-pointer";
    const iconButtonClass = `${buttonClass} text-orange-500 hover:text-orange-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400`;
    const numberButtonClass = (isActive: boolean) =>
      `${buttonClass} ${
        isActive
          ? "bg-orange-500 text-white font-bold"
          : "text-orange-500 hover:bg-orange-100 disabled:text-gray-400"
      }`;
    const ellipsisClass = `${buttonClass} text-orange-500`;

    return (
      <div className="flex flex-row justify-center items-center mt-3 gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={iconButtonClass}
          aria-label="First page"
        >
          <FontAwesomeIcon icon={faAnglesLeft} className="text-sm" />
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={iconButtonClass}
          aria-label="Previous page"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
        </button>

        <span
          className={`${ellipsisClass} ${
            showLeftEllipsis ? "visible" : "invisible"
          }`}
        >
          ...
        </span>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={numberButtonClass(page === currentPage)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}

        <span
          className={`${ellipsisClass} ${
            showRightEllipsis ? "visible" : "invisible"
          }`}
        >
          ...
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={iconButtonClass}
          aria-label="Next page"
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={iconButtonClass}
          aria-label="Last page"
        >
          <FontAwesomeIcon icon={faAnglesRight} className="text-sm" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full md:w-[80%] mx-auto pt-5">
      <div className="relative overflow-x-auto bg-neutral-primary-soft rounded-lg border border-gray-300">
        {isLoading && histories.length === 0 && (
          <div className="flex justify-center items-center h-48">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-2xl text-orange-500"
            />
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-48 text-red-500">
            {error}
          </div>
        )}
        {!isLoading && !error && histories.length === 0 && (
          <div className="flex justify-center items-center h-48 text-gray-500">
            로그인 기록이 없습니다.
          </div>
        )}
        {histories.length > 0 && (
          <table className="w-full text-sm text-left text-body rounded-lg">
            <thead className="text-sm text-body bg-orange-100 border-b rounded-lg border-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  일시
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  아이피
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  운영체제
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  브라우저
                </th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr
                  key={history.id}
                  className="bg-white border-b border-gray-300 hover:bg-gray-50 curosr-default text-xs"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {new Date(history.loginAt).toLocaleString("ko")}
                  </th>
                  <td className="px-6 py-4">{history.ip}</td>
                  <td className="px-6 py-4">{history.os}</td>
                  <td className="px-6 py-4">{history.browser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {renderPagination()}
    </div>
  );
}
