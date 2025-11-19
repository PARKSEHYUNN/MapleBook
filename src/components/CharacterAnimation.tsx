// src/components/CharacterAnimation.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  baseUrl: string | null;
};

export default function CharacterAnimation({ baseUrl }: Props) {
  const frameUrls = baseUrl
    ? [
        `${baseUrl}?action=A00.0`,
        `${baseUrl}?action=A00.1`,
        `${baseUrl}?action=A00.2`,
      ]
    : [];

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (frameUrls.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameUrls.length);
    }, 800);

    return () => clearInterval(interval);
  }, [frameUrls.length]);

  if (!baseUrl) {
    return (
      <div style={{ position: "relative", width: "256px", height: "256px" }}>
        <Image
          src="/default.png"
          alt="Default Character"
          unoptimized
          style={{ objectFit: "contain" }}
          width={256}
          height={256}
          priority
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "256px", height: "256px" }}>
      {frameUrls.map((url, index) => (
        <Image
          key={url}
          src={url}
          alt={`Character frame ${index}`}
          width={256}
          height={256}
          unoptimized
          decoding="sync"
          priority
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "contain",
            opacity: index === currentFrame ? 1 : 0,
            transition: "opacity 0ms",
            willChange: "opacity",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            scale: 1.5,
          }}
          className="translate-y-10"
        />
      ))}
    </div>
  );
}
