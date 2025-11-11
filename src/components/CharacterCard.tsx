// src/components/CharacterCard.tsx

import Image from "next/image";
import WorldIcon from "./WorldIcon";
import { Character } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type CharacterInfo = Pick<
  Character,
  | "ocid"
  | "character_name"
  | "world_name"
  | "character_class"
  | "character_level"
  | "character_image"
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
  const characterImage =
    character.character_image ??
    "https://avatar.maplestory.nexon.com/Character/180/default.png";

  return (
    <div
      onClick={() => onClick(character.ocid)}
      className={`
      w-full bg-white border rounded-lg shadow-md cursor-pointer transition-all duration-150 ${
        isSelected
          ? "border-orange-500 ring-2 ring-orange-400"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <div className="h-40 w-full relative overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={characterImage}
          alt={character.character_name}
          layout="fill"
          objectFit="cover"
          unoptimized={true}
          className="scale-[2.5] translate-y-4"
        />
      </div>

      <div className="p-3">
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
