// src/components/MainCharacterSelector.tsx

"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { Character } from "@prisma/client";
import CharacterCard from "./CharacterCard";
import WorldSelecter from "./WorldSelecter";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faSpinner } from "@fortawesome/free-solid-svg-icons";
import MainCharacterRefresh from "./MainCharacterRefresh";

export type MainCharacterSelectorHandle = {
  fetchCharacters: () => Promise<void>;
};

type CharacterInfo = Pick<
  Character,
  | "ocid"
  | "character_name"
  | "world_name"
  | "character_class"
  | "character_level"
  | "character_image"
  | "status"
  | "lastFetchedAt"
> & {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default forwardRef<MainCharacterSelectorHandle, {}>(
  function MainCharacterSelector(props, ref) {
    const { data: session, update } = useSession();

    const [characterList, setCharacterList] = useState<CharacterInfo[]>([]);
    const [worldList, setWorldList] = useState<string[]>([]);
    const [currentWorld, setCurrentWorld] = useState("");
    const [isLoadingList, setisLoadingList] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedOcid, setSelectedOcid] = useState<string | null>(() => {
      if (!session?.user?.mainCharacterId || characterList.length === 0)
        return null;
      return (
        characterList.find((char) => char.id === session.user.mainCharacterId)
          ?.ocid || null
      );
    });
    const [isMainCharLoading, setIsMainCharLoading] = useState(false);
    const initialStaleCheckDone = useRef(false);
    const HOUR_MS = 1000 * 60 * 60;

    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchCharacters = async (isPolling = false) => {
      console.log(`캐릭터 목록 조회 (isPolling: ${isPolling})`);
      if (!isPolling) setisLoadingList(true);
      try {
        const res = await fetch("/api/user/characters");
        if (res.ok) {
          const data = await res.json();
          setCharacterList(data.characters);

          if (!isPolling) {
            const worldArray: string[] = ["전체"];
            data.characters.map(
              (char: CharacterInfo) =>
                worldArray.indexOf(char.world_name) === -1 &&
                worldArray.push(char.world_name)
            );
            setWorldList(worldArray);
            setCurrentWorld(worldArray[0] || "전체");
          }
        }
      } catch (error) {
        console.error("Failed to fetch characters", error);
      }
      if (!isPolling) setisLoadingList(false);
    };

    useImperativeHandle(ref, () => ({
      fetchCharacters,
    }));

    useEffect(() => {
      fetchCharacters();

      return () => {
        if (pollingIntervalRef.current)
          clearInterval(pollingIntervalRef.current);
      };
    }, []);

    useEffect(() => {
      const hasPending = characterList.some(
        (char) => char.status === "PENDING"
      );

      if (hasPending && !pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(() => {
          fetchCharacters(true);
        }, 5000);
      } else if (!hasPending && pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, [characterList]);

    useEffect(() => {
      if (session?.user?.mainCharacterId && characterList.length > 0) {
        const mainCharacterOcid = characterList.find(
          (char) => char.id === session.user.mainCharacterId
        )?.ocid;
        setSelectedOcid(mainCharacterOcid || null);
      }
    }, [session?.user?.mainCharacterId, characterList]);

    const handleSelectCharacter = async (ocid: string) => {
      if (isMainCharLoading) return;
      if (selectedOcid === ocid) setSelectedOcid(null);
      else setSelectedOcid(ocid);
    };

    const handleSetMainCharacter = async () => {
      if (!selectedOcid) return;
      setIsMainCharLoading(true);

      try {
        const res = await fetch("/api/user/main-character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ocid: selectedOcid }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "대표 캐릭터 설정에 실패했습니다.");
        }

        await update();

        Swal.fire({
          title: "변경 완료",
          text: "대표 캐릭터가 변경되었습니다.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: unknown) {
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (error instanceof Error) errorMessage = error.message;
        Swal.fire("오류", errorMessage, "error");
      } finally {
        setIsMainCharLoading(false);
      }
    };

    const currentMainOcid = useMemo(() => {
      if (!session?.user?.mainCharacterId || characterList.length === 0)
        return null;
      return (
        characterList.find((char) => char.id === session.user.mainCharacterId)
          ?.ocid || null
      );
    }, [session?.user?.mainCharacterId, characterList]);
    const showFloatingButton =
      selectedOcid && selectedOcid !== currentMainOcid && !isLoadingList;
    const filteredList = characterList.filter((char) => {
      if (currentWorld === "전체" || currentWorld === "") return true;
      return char.world_name === currentWorld;
    });

    const handleRefresh = useCallback(async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);

      try {
        const res = await fetch("/api/user/characters/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "갱신에 실패 했습니다.");

        await fetchCharacters();

        await update();
      } catch (error: unknown) {
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (error instanceof Error) errorMessage = error.message;
        Swal.fire("오류", errorMessage, "error");
      } finally {
        setIsRefreshing(false);
      }
    }, [isRefreshing, fetchCharacters]);

    const lastFetchedAt = useMemo(() => {
      if (!session?.user?.charactersLastFetchedAt) return null;
      return new Date(session.user.charactersLastFetchedAt);
    }, [session?.user?.charactersLastFetchedAt]);

    useEffect(() => {
      if (lastFetchedAt && !initialStaleCheckDone.current && !isRefreshing) {
        initialStaleCheckDone.current = true;

        const now = Date.now();
        const diffMs = now - lastFetchedAt.getTime();

        if (diffMs > HOUR_MS) handleRefresh();
      }
    }, [lastFetchedAt, isRefreshing, handleRefresh]);

    return (
      <div className="w-full mt-5">
        <div className="w-[80%] mx-auto pt-5 border-t border-gray-300">
          <h2 className="text-xl font-bold mb-3">대표 캐릭터 선택</h2>
          <div className="flex justify-between items-center relative">
            <MainCharacterRefresh
              onClick={handleRefresh}
              isLoading={isRefreshing}
              lastUpdated={lastFetchedAt}
            />
            <WorldSelecter
              list={worldList}
              selectedWorld={currentWorld || "전체"}
              onSelectWorld={setCurrentWorld}
            />
          </div>
        </div>

        <div className="w-[90%] mx-auto">
          {isLoadingList ? (
            <div className="flex justify-center items-center h-40">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
            </div>
          ) : (
            <div className="grid md:grid-cols-5 grid-cols-3 gap-3 mt-2">
              {filteredList.map((char) => (
                <CharacterCard
                  key={char.ocid}
                  character={char}
                  isSelected={selectedOcid === char.ocid}
                  onClick={handleSelectCharacter}
                />
              ))}
            </div>
          )}
        </div>

        {showFloatingButton && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleSetMainCharacter}
              disabled={isMainCharLoading}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isMainCharLoading && <FontAwesomeIcon icon={faSpinner} spin />}
              {isMainCharLoading ? "설정 중..." : "대표 캐릭터 선택"}
            </button>
          </div>
        )}
      </div>
    );
  }
);
