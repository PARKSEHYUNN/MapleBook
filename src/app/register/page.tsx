// src/app/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkPasswordStrength } from "@/utils/passwordStrength";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const strength = checkPasswordStrength(password);

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg p-5 bg-transparent">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">회원가입</h1>
      {error && (
        <span className="bg-red-600 text-white pt-2.5 pb-2.5 ps-5 pe-5 rounded-lg flex items-center mb-3 text-sm">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="sm"
            className="me-1"
          />
          {error}
        </span>
      )}
      <form
        className="w-[100%] md:w-[30%] flex flex-col justify-center"
        onSubmit={() => {}}
      >
        <div className="mb-3">
          <label
            htmlFor="useremail"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-start"
          >
            이메일
          </label>
          <input
            type="text"
            name="email"
            id="useremail"
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <div className="mb-5">
          <label
            htmlFor="userpassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-start"
          >
            비밀번호
          </label>
          <input
            type="password"
            name="passowrd"
            id="userpassword"
            value={password}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>

        <div className="mb-5 flex flex-col">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`${
                strength.level === "Low"
                  ? "bg-red-500"
                  : strength.level === "Medium"
                  ? "bg-orange-500"
                  : "bg-green-500"
              } h-2.5 rounded-full flex`}
              style={{
                width: `${strength.score}%`,
              }}
            ></div>
          </div>

          <span className="text-gray-900 dark:text-white text-sm font-semibold">
            비밀번호 보안:{" "}
            <span
              className={`${
                strength.level === "Low"
                  ? "text-red-500"
                  : strength.level === "Medium"
                  ? "text-orange-500"
                  : "text-green-500"
              }`}
            >
              {`${
                strength.level === "Low"
                  ? "낮음"
                  : strength.level === "Medium"
                  ? "보통"
                  : "강함"
              }`}
            </span>
          </span>
          <span className="text-gray-900 dark:text-white text-sm text-start">
            · 대, 소문자 영어, 숫자, 특수문자 중 3개 이상
          </span>
          <span className="text-gray-900 dark:text-white text-sm text-start">
            · 길이 8자리 이상, 64자리 이하
          </span>
        </div>

        <div className="mb-2">
          <label
            htmlFor="userpassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-start"
          >
            비밀번호 재입력
          </label>

          <input
            type="password"
            name="passowrd-retype"
            id="userpasswordretype"
            value={passwordRetype}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="비밀번호 재입력"
            onChange={(e) => setPasswordRetype(e.target.value)}
            onBlur={() => {
              if (password !== passwordRetype) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
              }
            }}
            required
          ></input>
        </div>
        <div className="mb-5">
          <span
            className={`text-red-500 text-sm font-semibold ${
              !passwordError && "hidden"
            }`}
          >
            비밀번호가 일치하지 않습니다.
          </span>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800 cursor-pointer"
        >
          회원가입
        </button>
        <Link
          href={"/login"}
          className="text-center text-sm text-orange-600 hover:text-orange-700 mt-1 mb-2"
        >
          돌아가기
        </Link>
      </form>
    </div>
  );
}
