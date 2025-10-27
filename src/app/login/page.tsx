// src/app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        console.log(result.error);
      } else if (result?.ok) {
        if (saveEmail) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }
        router.push("/");
      }
    } catch (err) {
      console.error("로그인 중 오류 발생: ", err);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg p-5 bg-transparent">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">로그인</h1>
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
        onSubmit={handleSubmit}
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
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="saveemail"
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
          />
          <label
            htmlFor="saveemail"
            className="block ms-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            이메일 저장
          </label>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800 cursor-pointer"
        >
          로그인
        </button>
        <Link
          href={"/register"}
          className="text-center text-sm text-orange-600 hover:text-orange-700 mt-1 mb-2"
        >
          회원가입
        </Link>
        <Link
          href={"/password"}
          className="text-center text-sm text-orange-600 hover:text-orange-700 mt-1"
        >
          비밀번호 찾기
        </Link>
      </form>
    </div>
  );
}
