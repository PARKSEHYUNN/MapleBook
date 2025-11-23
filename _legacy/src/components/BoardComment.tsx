// src/components/BoardComment.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WorldIcon from "./WorldIcon";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  characterData?: CharacterData;
  comment: string;
  createdAt: Date;
};

type CharacterData = {
  ocid: string;
  characterName: string;
  characterImage: string;
  worldName: string;
  characterLevel: number;
};

export default function BoardComment({
  characterData,
  comment,
  createdAt,
}: Props) {
  const router = useRouter();

  if (!characterData) {
    return (
      <div className="border border-gray-300 rounded-lg p-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[1fr_9fr] gap-2 border border-gray-300 rounded-lg p-3">
      <div className="w-full">
        <Image
          src={characterData.characterImage}
          width={128}
          height={128}
          alt="Character Image"
          className="scale-[3] -translate-y-3 pointer-events-none"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex flex-row items-center justify-between gap-2 border-b border-gray-300 pb-2">
            <div
              className="flex flex-row items-center gap-2 hover:cursor-pointer"
              onClick={() =>
                router.push(`/user/${characterData.characterName}`)
              }
            >
              <div>
                <WorldIcon worldName={characterData.worldName} />
              </div>
              <p className="galmuri text-sm">{characterData.characterName}</p>
              <p className="galmuri text-xs">
                Lv. {characterData.characterLevel}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <button className="text-red-500 hover:text-red-700 cursor-pointer">
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <FontAwesomeIcon icon={faPencil} className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 text-gray-800 whitespace-pre-wrap leading-relaxed galmuri text-sm">
          {comment}
        </div>

        <div className="flex justify-end px-1 mt-2">
          <span className="text-gray-400 font-light galmuri text-xs">
            {createdAt.toLocaleDateString("ko-KR")}{" "}
            {createdAt.toLocaleTimeString("ko-KR")}
          </span>
        </div>
      </div>
    </div>
  );
}
