// src/components/user/Board.tsx

"use client";

import { useSession } from "next-auth/react";
import WorldIcon from "../WorldIcon";

export default function Board() {
  const { data: session, status } = useSession();

  return (
    <div>
      <div className="w-full">
        <div className="relative border-b border-gray-300 pb-3 mb-3">
          <textarea
            id="message"
            rows={4}
            className="resize-none border border-gray-300 text-heading text-sm block w-full p-2 shadow-xs placeholder:text-body rounded-lg focus:ring-none"
            placeholder={
              status === "authenticated"
                ? "로그인 후 방명록을 남겨 보세요!"
                : "방명록을 남겨 보세요!"
            }
            disabled={status === "authenticated" ? true : false}
          ></textarea>
          <button
            className="btn btn-outline-orange px-1.5 py-0.5 text-sm absolute bottom-4 right-1"
            disabled={status === "authenticated" ? true : false}
          >
            작성
          </button>
        </div>

        <div>
          <ul className="w-full gap-2">
            <li className="border border-gray-300 rounded-lg p-3 mb-1">
              <div className="flex flex-col text-sm">
                <div className="flex flex-row items-center font-bold">
                  <span>Lv. 270 이름</span>
                  <div className="ms-1">
                    <WorldIcon worldName="스카니아" />
                  </div>
                </div>

                <span className="ms-1">안냥</span>
              </div>
            </li>
            <li className="border border-gray-300 rounded-lg p-3 mb-1">
              <div className="flex flex-col text-sm">
                <div className="flex flex-row items-center font-bold">
                  <span>Lv. 270 이름</span>
                  <div className="ms-1">
                    <WorldIcon worldName="스카니아" />
                  </div>
                </div>

                <span className="ms-1">안냥</span>
              </div>
            </li>
            <li className="border border-gray-300 rounded-lg p-3 mb-1">
              <div className="flex flex-col text-sm">
                <div className="flex flex-row items-center font-bold">
                  <span>Lv. 270 이름</span>
                  <div className="ms-1">
                    <WorldIcon worldName="스카니아" />
                  </div>
                </div>

                <span className="ms-1">안냥</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
