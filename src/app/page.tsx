// src/app/page.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "authenticated") {
    return (
      <div>
        <h2>반갑습니다, {session.user?.name} 님!</h2>
        <p>로그인 된 이메일: {session.user?.email}</p>

        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="프로필 사진"
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
        )}

        <br />
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <button onClick={() => signIn("google")}>구글 로그인</button>
    </div>
  );
}
