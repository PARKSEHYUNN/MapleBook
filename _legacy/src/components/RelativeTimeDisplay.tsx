// src/components/RelativeTimeDisplay.tsx

"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type Props = {
  timestamp: Date | string | null | undefined;
};

export default function RelativeTimeDisplay({ timestamp }: Props) {
  const [displayTime, setDisplayTime] = useState("정보 없음");

  useEffect(() => {
    if (!timestamp) return;

    const date = new Date(timestamp);

    const updateRelativeTime = () => {
      const relative = formatDistanceToNow(date, {
        addSuffix: true,
        locale: ko,
      });

      setDisplayTime(relative);
    };

    updateRelativeTime();

    const intervalId = setInterval(updateRelativeTime, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <>{displayTime}</>;
}
