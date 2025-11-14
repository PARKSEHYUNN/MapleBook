// src/components/MainCharacterRefresh.tsx

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

type MainCharacterRefreshProps = {
  onClick: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
};

const COOLDOWN_MINUTES = 5;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

export default function MainCharacterRefresh({
  onClick,
  isLoading,
  lastUpdated,
}: MainCharacterRefreshProps) {
  const [displayTime, setDisplayTime] = useState("정보 없음");
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!lastUpdated) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diffMs = now - lastUpdated.getTime();

      if (diffMs < COOLDOWN_MS) {
        setIsCoolingDown(true);
        const secondsLeft = Math.ceil((COOLDOWN_MS - diffMs) / 1000);

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        setRemainingTime({ minutes, seconds });
      } else {
        setIsCoolingDown(false);
        setRemainingTime({ minutes: 0, seconds: 0 });

        setDisplayTime(
          formatDistanceToNow(lastUpdated, {
            addSuffix: true,
            locale: ko,
          })
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  const isDisabled = isLoading || isCoolingDown;

  return (
    <div className="flex items-center">
      <button
        className="btn btn-outline-orange group w-9 h-9 p-0"
        onClick={isDisabled ? undefined : onClick}
        disabled={isLoading || isCoolingDown}
      >
        <FontAwesomeIcon
          icon={faArrowsRotate}
          className={`text-xs ${
            isLoading
              ? "animate-spin"
              : isCoolingDown
              ? ""
              : "group-hover:animate-spin"
          }`}
        />
      </button>
      <span className="text-sm ms-2">
        {isLoading
          ? "갱신 중..."
          : isCoolingDown
          ? `${
              remainingTime.minutes <= 0 ? "" : `${remainingTime.minutes}분`
            } ${remainingTime.seconds}초 후 갱신 가능`
          : `최근 업데이트: ${displayTime}`}
      </span>
    </div>
  );
}
