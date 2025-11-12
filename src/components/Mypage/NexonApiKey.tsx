// src/components/Myage/NexonApiKey.tsx

"use client";

import { useRef } from "react";
import ApiKeyManager from "../ApiKeyManager";

import MainCharacterSelector, {
  MainCharacterSelectorHandle,
} from "../MainCharacterSelector";

export default function NexonApiKey() {
  const charSelectorRef = useRef<MainCharacterSelectorHandle>(null);
  const handleKeyUpdated = () => {
    charSelectorRef.current?.fetchCharacters();
  };

  return (
    <>
      <ApiKeyManager onKeyUpdated={handleKeyUpdated} />
      <MainCharacterSelector ref={charSelectorRef} />
    </>
  );
}
