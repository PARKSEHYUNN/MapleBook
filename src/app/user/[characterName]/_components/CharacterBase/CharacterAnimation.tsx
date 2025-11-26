// src/app/user/[characterName]/_components/CharacterBase/CharacterAnimation.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type CharacterAnimationProps = {
  baseUrl: string | null | undefined;
};

export default function CharacterAnimation({
  baseUrl,
}: CharacterAnimationProps) {
  const frameUrls = baseUrl
    ? [
        `${baseUrl}&action=A00.0`,
        `${baseUrl}&action=A00.1`,
        `${baseUrl}&action=A00.2`,
        `${baseUrl}&action=A00.1`,
      ]
    : [];

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (frameUrls.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameUrls.length);
    }, 500);

    return () => clearInterval(interval);
  }, [baseUrl, frameUrls.length]);

  if (!baseUrl) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={baseUrl ?? '/images/character/default.png'}
          width={256}
          height={256}
          className="translate-y-10 scale-[1.5]"
          alt="Character Image"
          style={{ objectFit: 'contain' }}
          priority
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {frameUrls.map((url, index) => (
        <Image
          key={index}
          src={url ?? '/images/character/default.png'}
          width={256}
          height={256}
          decoding="sync"
          priority
          unoptimized
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'contain',
            opacity: index === currentFrame ? 1 : 0,
            transition: 'opacity 0ms',
            willChange: 'opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            scale: 1.5,
          }}
          className="translate-y-10"
          alt={`Character frame ${index}`}
        />
      ))}
    </div>
  );
}
