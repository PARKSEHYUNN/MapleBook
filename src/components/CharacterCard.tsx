// src/components/CharacterCard.tsx

import Image from "next/image";
import WorldIcon from "./WorldIcon";
import { Character } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type CharacterInfo = Pick<
  Character,
  | "ocid"
  | "character_name"
  | "world_name"
  | "character_class"
  | "character_level"
  | "character_image"
  | "status"
>;

interface CharacterCardProps {
  character: CharacterInfo;
  onClick: (ocid: string) => void;
  isSelected: boolean;
}

export default function CharacterCard({
  character,
  onClick,
  isSelected,
}: CharacterCardProps) {
  const characterImage = character.character_image ?? "/default.png";
  //"https://open.api.nexon.com/static/maplestory/character/look/ADHAIEILKDFJNANEIPCHJFMKFGIJEGFHGHLEILKHMLJELENNFEBBKLANFHIHAJDJFLJCHCHALFAAFAOOECIJIMNBDEGBKKBBNNEGFMLOMGPJMPDCACBKBEEHFEMIJLMDAPJCGKHAIDJJPAJPFAPKBPNCENBKMDFCDCAOLAFCBOKIMNEOJJGENEFCDMAOGDNHJFLBKLKAJFIPMGOJNBMGKPNLAHGNNKAKMGHMPODILDBPKELAHCOFDKBDMIJAOJFB";

  const isDisabled =
    character.status === "PENDING" || character.status === "FAILED";

  return (
    <div
      onClick={() => {
        if (!isDisabled) onClick(character.ocid);
      }}
      className={`
      relative w-full bg-white border rounded-lg shadow-md cursor-pointer transition-all duration-150 ${
        isSelected
          ? "border-orange-500 ring-2 ring-orange-400"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {(character.status === "PENDING" || character.status === "FAILED") && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-2xs rounded-lg">
          {character.status === "PENDING" && (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              <span className="mt-2 text-sm font-semibold text-gray-700">
                로딩 중...
              </span>
            </>
          )}
          {character.status === "FAILED" && (
            <>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="h-8 w-8 text-red-500"
              />
              <span className="mt-2 text-sm font-semibold text-red-600">
                갱신 실패
              </span>
              <span className="mt-2 text-sm font-semibold text-gray-500">
                캐릭터를 1회 이상 접속해주세요.
              </span>
            </>
          )}
        </div>
      )}
      <div className="h-40 w-full relative overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={characterImage}
          alt={character.character_name}
          layout="fill"
          objectFit="cover"
          unoptimized={true}
          className="scale-[2] translate-x-0.5 translate-y-0 bg-white"
        />
      </div>

      <div className="p-3 flex flex-col items-center justify-center">
        <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 truncate">
          {character.character_name}
        </h5>

        <p className="font-normal text-sm text-gray-700">
          Lv. {character.character_level}
        </p>

        <p className="font-normal text-sm text-gray-500 truncate">
          {character.character_class}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <WorldIcon worldName={character.world_name} />
          <span className="font-normal text-sm text-gray-500">
            {character.world_name}
          </span>
        </div>
      </div>
    </div>
  );
}
