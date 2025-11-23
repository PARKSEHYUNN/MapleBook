// src/components/LoginManager.tsx

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

interface SessionData {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
  createAt: string;
  ip: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
}

export default function LoginManager() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/user/login-manager");
      if (!res.ok)
        throw new Error("로그인 관리 정보를 불러오는데 실패 했습니다.");

      const data = await res.json();
      setSessions(data.sessions);
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
    fetchSession();
  }, [fetchSession]);

  const handleForceLogout = async (sessionToken: string) => {
    try {
      const res = await fetch(`/api/user/login-manager?token=${sessionToken}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("강제 로그아웃에 실패 했습니다.");

      fetchSession();

      Swal.fire({
        title: "강제 로그아웃 성공",
        text: "해당 세션을 강제로 로그아웃 시켰습니다.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생 했습니다."
      );
    }
  };

  return (
    <div className="border-t border-gray-300 w-full md:w-[80%] mx-auto mt-5 pt-5">
      <h2 className="text-xl font-bold mb-3 text-gray-900">로그인 관리</h2>

      <div className="relative overflow-x-auto bg-neutral-primary-soft rounded-lg border border-gray-300">
        {isLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-2xl text-orange-500"
          />
        )}

        {error && (
          <div className="flex justify-center items-center h-48 text-red-500">
            {error}
          </div>
        )}

        {sessions && (
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
                <th scope="col" className="px-6 py-3 font-medium">
                  강제 로그아웃
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sessionData) => (
                <tr
                  key={sessionData.id}
                  className="bg-white border-b border-gray-300 hover:bg-gray-50 curosr-default text-xs"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {new Date(sessionData.createAt).toLocaleString("ko")}
                  </th>
                  <td className="px-6 py-4">{sessionData.ip}</td>
                  <td className="px-6 py-4">{sessionData.os}</td>
                  <td className="px-6 py-4">{sessionData.browser}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session?.sessionToken === sessionData.sessionToken ? (
                      <span className="text-center">현재 세션</span>
                    ) : (
                      <button
                        className="btn btn-outline-red text-sm"
                        onClick={() =>
                          handleForceLogout(sessionData.sessionToken)
                        }
                      >
                        로그아웃
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
